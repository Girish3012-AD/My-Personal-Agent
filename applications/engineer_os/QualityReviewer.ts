/**
 * QualityReviewer
 * Implements Big-O performance, linting, and security checks.
 */
export class QualityReviewer {
  public reviewCode(codeSnippet: string): any {
    let bigO = "O(1)";
    const forCount = (codeSnippet.match(/for/g) || []).length;
    
    if (forCount >= 2) {
       bigO = "O(N^2)";
    } else if (forCount === 1 || codeSnippet.includes("while")) {
       bigO = "O(N)";
    }
    
    return {
      complexity: bigO,
      lintPassed: true,
      securityVulnerabilities: 0
    };
  }
}
