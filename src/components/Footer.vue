<template>
  <footer class="footer" style="border-top-style: outset; margin-top: 40px;">
    <div class="container">
      <div class="columns">
        <div class="column is-4">
          <h4 class="bd-footer-title">
            <strong>{{ title }}</strong> by
            <a href="http://ctechhindi.in">C Tech Hindi</a>.
          </h4>
          <p class="bd-footer-link-title">
            <a target="_blank" :href="youtubeLink"><i class="mdi mdi-youtube"></i> YouTube</a>
            <br>
            <a target="_blank" :href="githubLink"><i class="mdi mdi-git"></i> GitHub</a>
          </p>
          <div class="bd-footer-tsp">
            Source code licensed
            <a target="_blank" href="https://opensource.org/licenses/mit-license.php">MIT</a>.
          </div>
        </div>
        <div class="column is-8">
          <div class="content has-text-centered has-text-dark">
            <p>
              It is our policy to respect your privacy regarding any information we may collect from you across our
              google extension.
            </p>Made with
            <span class="icon has-text-danger">
              <i class="mdi mdi-heart mdi-24px"></i>
            </span> in India
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import app from "../manifest.json";

export default {
  name: "Header",
  data() {
    return {
      title: app.name,
      youtubeLink: "https://www.youtube.com/channel/UCfd4AN4UKiWyHDdq-fizQGA",
      githubLink: "https://github.com/ctechhindi",
    };
  }
};
</script>