import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  CONTACT_LIMITS,
  EMAIL_REGEX,
  escapeHtml,
  isHoneypotTriggered,
  validateContactField,
  validateContactPayload,
} from "../lib/contact-validation.ts";
import { InMemoryRateLimiter } from "../lib/rate-limit.ts";
import {
  getCaseStudyProject,
  getCaseStudySlugs,
  isValidHttpUrl,
  isValidProject,
  projects,
} from "../data/projects.ts";
import { getCaseStudyContent } from "../data/case-studies.ts";

function collectLeafKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectLeafKeys(value as Record<string, unknown>, fullKey));
    } else {
      assert.equal(typeof value, "string", `Expected string at i18n key "${fullKey}"`);
      assert.ok((value as string).trim().length > 0, `Expected non-empty translation at "${fullKey}"`);
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

test("contact validation accepts valid inputs and catches invalid formats", () => {
  assert.equal(EMAIL_REGEX.test("silo@example.com"), true);
  assert.equal(EMAIL_REGEX.test("user.name+tag@sub.domain.org"), true);
  assert.equal(EMAIL_REGEX.test("not-an-email"), false);
  assert.equal(EMAIL_REGEX.test("foo@bar"), false);
  assert.equal(EMAIL_REGEX.test("foo@bar.c"), false);
  assert.equal(EMAIL_REGEX.test("bad email@example.com"), false);

  assert.equal(validateContactField("name", ""), "nameRequired");
  assert.equal(validateContactField("name", "A"), "nameTooShort");
  assert.equal(
    validateContactField("name", "A".repeat(CONTACT_LIMITS.NAME_MAX + 1)),
    "nameTooLong",
  );
  assert.equal(validateContactField("name", "  Silo  "), null);

  assert.equal(validateContactField("email", ""), "emailRequired");
  assert.equal(validateContactField("email", "invalid@"), "emailInvalid");
  assert.equal(validateContactField("email", "silo@example.com"), null);

  assert.equal(validateContactField("message", "   "), "messageRequired");
  assert.equal(validateContactField("message", "short"), "messageTooShort");
  assert.equal(
    validateContactField("message", "x".repeat(CONTACT_LIMITS.MESSAGE_MAX + 1)),
    "messageTooLong",
  );
  assert.equal(
    validateContactField("message", "Hello Silo, let's discuss a TypeScript project."),
    null,
  );
});

test("validateContactPayload trims valid fields and aggregates errors", () => {
  const invalid = validateContactPayload({ name: "", email: "bad", message: "hi" });
  assert.equal(invalid.ok, false);
  if (!invalid.ok) {
    assert.deepEqual(invalid.errors, {
      name: "nameRequired",
      email: "emailInvalid",
      message: "messageTooShort",
    });
  }

  const valid = validateContactPayload({
    name: "  Đỗ Trường Thịnh  ",
    email: "  dev@example.com ",
    message: "  Interested in collaborating on a Next.js + AI app.  ",
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.deepEqual(valid.data, {
      name: "Đỗ Trường Thịnh",
      email: "dev@example.com",
      message: "Interested in collaborating on a Next.js + AI app.",
    });
  }
});

test("honeypot detection and HTML escaping work as expected", () => {
  assert.equal(isHoneypotTriggered(undefined), false);
  assert.equal(isHoneypotTriggered(""), false);
  assert.equal(isHoneypotTriggered("   "), false);
  assert.equal(isHoneypotTriggered("https://spam.example"), true);

  assert.equal(
    escapeHtml(`<script>alert("xss" & '1')</script>`),
    "&lt;script&gt;alert(&quot;xss&quot; &amp; &#39;1&#39;)&lt;/script&gt;",
  );
});

test("InMemoryRateLimiter enforces limits per key and resets after window", () => {
  const limiter = new InMemoryRateLimiter();
  const baseTime = 1_000_000;

  for (let i = 0; i < 5; i += 1) {
    const res = limiter.check("ip:1", 5, 60_000, baseTime + i * 100);
    assert.equal(res.allowed, true);
    assert.equal(res.remaining, 4 - i);
  }

  const blocked = limiter.check("ip:1", 5, 60_000, baseTime + 1_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfterSeconds >= 1);

  const otherIp = limiter.check("ip:2", 5, 60_000, baseTime + 1_000);
  assert.equal(otherIp.allowed, true);
  assert.equal(otherIp.remaining, 4);

  const afterReset = limiter.check("ip:1", 5, 60_000, baseTime + 60_001);
  assert.equal(afterReset.allowed, true);
  assert.equal(afterReset.remaining, 4);
});

test("project catalog integrity and discontinued policy hold", () => {
  for (const project of projects) {
    assert.equal(isValidProject(project), true, `Invalid project: ${project.id}`);
  }

  const orbis = projects.find((p) => p.id === "orbis");
  const nimbora = projects.find((p) => p.id === "nimbora");
  assert.ok(orbis && nimbora);
  assert.equal("discontinued" in orbis && orbis.discontinued, true);
  assert.equal("discontinued" in nimbora && nimbora.discontinued, true);
  assert.equal("demoUrl" in orbis, false);
  assert.equal("repositoryUrl" in orbis, false);
  assert.equal("demoUrl" in nimbora, false);
  assert.equal("repositoryUrl" in nimbora, false);

  const slugs = getCaseStudySlugs();
  assert.deepEqual(slugs, ["auratype", "antigravity-mod"]);
  assert.equal(getCaseStudyProject("orbis-agent"), undefined);
  assert.equal(getCaseStudyProject("nimbora"), undefined);

  const auratype = getCaseStudyProject("auratype");
  const antigravityMod = getCaseStudyProject("antigravity-mod");
  assert.ok(auratype && antigravityMod);
  assert.equal(isValidHttpUrl(auratype.demoUrl), true);
  assert.equal(isValidHttpUrl(auratype.repositoryUrl), true);
  assert.equal(isValidHttpUrl(antigravityMod.demoUrl), false);
  assert.equal(isValidHttpUrl(antigravityMod.repositoryUrl), true);

  for (const slug of slugs) {
    const vi = getCaseStudyContent("vi", slug);
    const en = getCaseStudyContent("en", slug);
    assert.ok(vi && en, `Missing case study content for ${slug}`);
    assert.ok(vi.features.length >= 3);
    assert.ok(en.features.length >= 3);
  }

  const modVi = getCaseStudyContent("vi", "antigravity-mod");
  const modEn = getCaseStudyContent("en", "antigravity-mod");
  assert.ok(modVi?.notice && modVi.notice.length > 10);
  assert.ok(modEn?.notice && modEn.notice.length > 10);
});

test("vi.json and en.json have identical non-empty message keys", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const vi = JSON.parse(fs.readFileSync(path.join(root, "messages", "vi.json"), "utf8")) as Record<string, unknown>;
  const en = JSON.parse(fs.readFileSync(path.join(root, "messages", "en.json"), "utf8")) as Record<string, unknown>;

  const viKeys = collectLeafKeys(vi);
  const enKeys = collectLeafKeys(en);
  assert.deepEqual(viKeys, enKeys);
  assert.ok(viKeys.length > 40);
});
