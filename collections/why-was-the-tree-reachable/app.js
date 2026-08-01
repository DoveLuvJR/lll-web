/* Why Was the Tree Reachable? — page behavior
 *
 * There is almost nothing here, and that is the point.
 *
 * Both of this study's components are static. The four older readings are
 * cards, not tabs, because the section's move is comparison and a tab strip
 * makes comparison impossible (D-014). The drift panel stacks all three
 * retellings for the same reason — the point is that the command changed
 * across three mouths, which reads better seen at once than stepped through,
 * and stacking is what makes select-all-copy, Ctrl+F, translation tools,
 * screen readers, and print all work without a line of code written for any
 * of them.
 *
 * What remains is the share row. If this file fails to load, the study is
 * unaffected except that three buttons stop working.
 */

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => showToast("Link copied to clipboard"))
    .catch(() => showToast("Couldn't copy — try manually"));
}

function shareNative() {
  if (navigator.share) {
    navigator.share({
      title: "Why Was the Tree Reachable?",
      text: "A question the older answers mostly skip — a study for the Growing Stone Fellowship",
      url: window.location.href
    });
  } else {
    copyLink();
  }
}

function showToast(m) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = m;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}
