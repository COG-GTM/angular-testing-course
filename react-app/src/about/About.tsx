export const ABOUT_IMAGE_URL =
  'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png';

/**
 * Port of about.component.html. The legacy `<img>` has two `class` attributes and the browser keeps
 * only the first one Angular compiles (`course-image mat-elevation-z10`), so `.course-logo`
 * (max-width 200px, radius 4px) never applied: the image renders at its natural size with the z10 shadow.
 */
export function About() {
  return (
    <div className="container">
      <h1>Welcome!</h1>

      <p>Welcome to the Angular Testing Course</p>

      <img className="course-image mat-elevation-z10" src={ABOUT_IMAGE_URL} alt="Angular Testing Course" />
    </div>
  );
}
