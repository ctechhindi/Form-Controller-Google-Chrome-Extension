<template>
  <div class="options">
    <!-- Header -->
    <Header />
    <!-- Page Content -->
    <b-tabs v-model="activeTabIndex" position="is-centered" expanded class="block">
      <!-- Page URL -->
      <b-tab-item label="Page URL" icon="book-open-page-variant">
        <div class="container">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <p class="title is-5">Form URL's</p>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-tooltip label="Add New Page URL" type="is-success" position="is-top">
                  <b-button type="is-success" icon-left="plus" @click="addNewPageURL"></b-button>
                </b-tooltip>
                <b-tooltip type="is-danger" label="Delete All URL" style="margin-left: 5px;">
                  <b-button type="is-danger" icon-left="delete" @click="deletePageURL('all')"></b-button>
                </b-tooltip>
              </div>
              <div class="level-item"><strong>|</strong></div>
              <div class="level-item">
                <b-tooltip label="Import Backup Data" type="is-primary">
                  <b-upload v-model="importJSONFile" :required="true" @input="importBackupData">
                    <a class="button is-primary">
                      <b-icon icon="file-import"></b-icon>
                      <span>Import</span>
                    </a>
                  </b-upload>
                </b-tooltip>
                <a id="exportJSONDataHref" style="display:none"></a>
                <b-tooltip label="Export Backup Data" type="is-dark" style="margin-left: 5px;">
                  <b-button type="is-dark" icon-left="file-export" @click="exportBackupData">Export</b-button>
                </b-tooltip>
              </div>
            </div>
          </nav>
          <!-- URL's Table -->
          <table
            class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
            v-if="pageURLs.length > 0"
          >
            <thead>
              <th>#</th>
              <th>Page URL</th>
              <th>URL Match Type</th>
              <th>Active</th>
              <th>Action</th>
            </thead>
            <tbody>
              <tr v-for="(data, index) in pageURLs" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <b-input v-model="data.url" placeholder="Enter Page URL"></b-input>
                </td>
                <td style="width: 250px;">
                  <b-field>
                    <b-select
                      v-model="data.pageMatchType"
                      placeholder="Select page match type"
                      @input="changeURLType($event, index)"
                      expanded
                    >
                      <option value="full">Full Page URL</option>
                      <option value="pathname">location.pathname</option>
                    </b-select>
                  </b-field>
                </td>
                <td style="width: 100px;">
                  <div class="field" style="margin-top: 5px;">
                    <b-switch v-model="data.isActive" type="is-success"></b-switch>
                  </div>
                </td>
                <td style="width: 150px;">
                  <b-tooltip type="is-primary" label="Form Fields">
                    <b-button
                      type="is-primary"
                      icon-left="format-list-bulleted"
                      @click="openURLFieldTab(index)"
                    ></b-button>
                  </b-tooltip>&nbsp;
                  <b-tooltip
                    :type="(data.isRunScript == true)? 'is-success':'is-warning'"
                    label="Insert JS Script"
                  >
                    <b-button
                      :type="(data.isRunScript == true)? 'is-success':'is-warning'"
                      icon-left="nodejs"
                      @click="openScriptModel(index)"
                    ></b-button>
                  </b-tooltip>&nbsp;
                  <b-tooltip type="is-danger" label="Delete URL">
                    <b-button type="is-danger" icon-left="delete" @click="deletePageURL(index)"></b-button>
                  </b-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Data not found! -->
          <table v-else class="table is-bordered is-fullwidth">
            <tr>
              <td class="has-text-centered">
                <p class="has-text-danger is-size-3">Not Data Found!</p>
                <p class="has-text-link is-size-6 is-family-code">ADD NEW PAGE URL.</p>
              </td>
            </tr>
          </table>
        </div>
      </b-tab-item>

      <!-- Page URL Fields -->
      <b-tab-item label="Page Field" icon="format-list-bulleted">
        <div class="container" v-if="urlIndexForFieldTab !== false && pageURLs[urlIndexForFieldTab]">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <p class="title is-5" style="margin-bottom: 5px;">URL Fields: 
                  <code style="font: icon; font-weight: 400; margin-left: 10px;">{{ pageURLs[urlIndexForFieldTab].url }}</code>
                </p>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-tooltip label="Add New URL Field" type="is-success" position="is-top">
                  <b-button
                    type="is-success"
                    icon-left="plus"
                    @click="addNewURLField(urlIndexForFieldTab)"
                  ></b-button>
                </b-tooltip>
                <b-tooltip type="is-danger" label="Delete All URL Fields" style="margin-left: 5px;">
                  <b-button type="is-danger" icon-left="delete" @click="deleteURLField('all')"></b-button>
                </b-tooltip>
              </div>
            </div>
          </nav>
          <!-- URL Field Data -->
          <table
            class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
            v-if="Object.keys(pageURLs[urlIndexForFieldTab].field).length > 0"
          >
            <thead>
              <th>Field Name</th>
              <th>Field ID</th>
              <th>Field ID Type</th>
              <th>ON/OFF</th>
              <th>Script</th>
              <th>Action</th>
            </thead>
            <tbody>
              <tr v-for="(data, index) in pageURLs[urlIndexForFieldTab].field" :key="index">
                <td>{{ index }}</td>
                <td>
                  <b-input v-model="data.elmID" placeholder="Enter Field ID"></b-input>
                </td>
                <td style="width: 250px;">
                  <b-field>
                    <b-select
                      v-model="data.elmType"
                      placeholder="Select Field Element Type"
                      expanded
                    >
                      <option value="id">ID</option>
                      <option value="querySelector">document.querySelector()</option>
                    </b-select>
                  </b-field>
                </td>
                <!-- Field ON/OFF -->
                <td>
                  <div class="field" style="margin-top: 6px;">
                    <b-switch :value="true" type="is-success" v-model="data.isActive"></b-switch>
                  </div>
                </td>
                <td>
                  <b-tooltip :type="(data.isRunScript == true)? 'is-success':'is-warning'"
                    :label="(data.isRunScript == true)? 'Insert JS Script':'No Script'"
                  >
                    <b-icon :type="(data.isRunScript == true)? 'is-success':'is-grey'" icon="nodejs" />
                  </b-tooltip>&nbsp;
                </td>
                <!-- Action -->
                <td style="width: 130px;">
                  <b-tooltip type="is-dark" label="Field Action">
                    <b-button
                      type="is-dark"
                      icon-left="gesture-double-tap"
                      @click="openFieldActionPage(urlIndexForFieldTab, index)"
                    ></b-button>
                  </b-tooltip>&nbsp;
                  <b-tooltip type="is-danger" label="Delete URL Field">
                    <b-button type="is-danger" icon-left="delete" @click="deleteURLField(index)"></b-button>
                  </b-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Data not found! -->
          <table v-else class="table is-bordered is-fullwidth">
            <tr>
              <td class="has-text-centered">
                <p class="has-text-danger is-size-3">Not Data Found!</p>
                <p class="has-text-link is-size-6 is-family-code">please add url fields.</p>
              </td>
            </tr>
          </table>
        </div>
        <!-- Data not found! -->
        <div class="container" v-else>
          <table class="table is-bordered is-fullwidth">
            <tr>
              <td class="has-text-centered">
                <p class="has-text-danger is-size-3">URL NOT SELECT.</p>
                <p
                  class="has-text-link is-size-6 is-family-code"
                >Open the field of a particular url.</p>
              </td>
            </tr>
          </table>
        </div>
      </b-tab-item>
    </b-tabs>

    <!-- JS Script Model -->
    <b-modal :active.sync="pageJSModel.isOpen" scroll="keep">
      <div class="card">
        <header class="card-header has-background-dark">
          <p class="card-header-title has-text-white">JS Script for URL: {{ pageJSModel.url }}</p>
        </header>
        <div>
          <codemirror v-model="pageJSModel.code" :options="pageJSModel.options" />
        </div>
        <footer class="card-footer">
          <div class="card-footer-item">
            <div class="field">
              <b-checkbox v-model="pageJSModel.isRunScript">Run Script</b-checkbox>
            </div>
          </div>
          <div class="card-footer-item" @click="updatePageScript(pageJSModel.index)">
            <strong>Save</strong>
          </div>
        </footer>
      </div>
    </b-modal>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Vue from "vue";
import VueCodemirror from "vue-codemirror";
// import base style
import "codemirror/lib/codemirror.css";
// import language js
import "codemirror/mode/javascript/javascript.js";
// import theme style
// import 'codemirror/theme/base16-dark.css'
import "codemirror/theme/monokai.css";
Vue.use(
  VueCodemirror /* {
    options: { theme: 'base16-dark', ... },
    events: ['scroll', ...]
  } */
);

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import mixin from "@/mixins/global";

export default {
  name: "App",
  mixins: [mixin],
  components: { Header, Footer },
  data() {
    return {
      // Active Tab Index Key
      activeTabIndex: 0,
      // Page URLs Data (Array)
      pageURLs: [
        {
          url: "https://ctechhindi.in",
          pageMatchType: "full",
          isActive: true,
          isRunScript: false,
          script: "",
          // URL Fields
          field: {}
        }
      ],
      // Page JS Script Model Data
      pageJSModel: {
        isOpen: false,
        url: "",
        index: false,
        isRunScript: false,
        code: "",
        options: {
          tabSize: 2,
          mode: "text/javascript",
          theme: "monokai",
          lineNumbers: true,
          line: true
        }
      },
      // Open URL Field Data (index)
      urlIndexForFieldTab: 0,
      // Backup JSON File Data
      importJSONFile: null,
    };
  },

  methods: {
    /**
     * Add New Page URL
     */
    addNewPageURL() {
      if (typeof this.pageURLs === "object") {
        // Add New Page URL
        this.pageURLs.push({
          url: "",
          pageMatchType: "full",
          isActive: true,
          isRunScript: false,
          script: "",
          // URL Fields
          field: {}
        });
      }
    },

    /**
     * Delete Page URL (all|index)
     * @param {number|String} index
     */
    deletePageURL(index) {
      if (index === undefined || index === null || index === "") {
        return false;
      }

      // Delete Page URL with 'all' and array index
      if (index === "all") {
        this.$buefy.dialog.confirm({
          title: "Deleting All Page URL",
          message:
            "Are you sure you want to <b>delete</b> all page url data? This action cannot be undone.",
          confirmText: "Delete",
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => {
            this.pageURLs = [];
          }
        });
      } else {
        this.$buefy.dialog.confirm({
          title: "Deleting Page URL",
          message:
            "Are you sure you want to <b>delete</b> this page url data? This action cannot be undone.",
          confirmText: "Delete",
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => {
            if (this.pageURLs[index] !== undefined) {
              this.pageURLs.splice(index, 1);
            }
          }
        });
      }
    },

    /**
     * Insert JS Script
     * @param {number} index
     */
    openScriptModel(index) {
      if (
        this.pageURLs[index] !== undefined &&
        Object.keys(this.pageURLs[index]).length > 0
      ) {
        var data = this.pageURLs[index];
        // JS Script Data
        this.pageURLs.code = data.script;
        this.pageURLs.isRunScript = data.isRunScript;

        // Model Data
        this.pageJSModel.index = index;
        this.pageJSModel.url = data.url;
        this.pageJSModel.code = data.script;
        this.pageJSModel.isRunScript = data.isRunScript;

        setTimeout(() => {
          this.pageJSModel.isOpen = true;
        }, 200);
      }
    },

    /**
     * Update Page JS Script
     * @param {number} index
     */
    updatePageScript(index) {
      if (index === undefined || index === null || index === "") {
        return false;
      }

      if (this.pageURLs[index] !== undefined) {
        var data = this.pageURLs[index];

        data["script"] = this.pageJSModel.code;
        data["isRunScript"] = this.pageJSModel.isRunScript;

        this.$buefy.toast.open({
          message: "JS Script Updated.",
          type: "is-success"
        });
      }
    },

    /**
     * Open URL Field Tab
     * @param {number} index
     */
    openURLFieldTab(index) {
      if (index === undefined || index === null || index === "") {
        return false;
      }

      if (this.pageURLs[index] !== undefined) {
        this.urlIndexForFieldTab = index;

        // Open Field Tab
        this.activeTabIndex = 1;
      }
    },

    /**
     * Change URL Match Type
     * --------------------------------
     * Change Full URL to pathname URL
     */
    changeURLType(val, index) {
      if (val) {
        // Check URL
        if (this.pageURLs[index] && this.pageURLs[index].url) {
          if (val === "pathname" && this.pageURLs[index].url !== "") {
            try {
              var url = new URL(this.pageURLs[index].url);
              if (url.pathname) {
                this.pageURLs[index].url = url.pathname
              }
            } catch (error) {
              console.error("changeActionURLType -> error", error)
            }
          } else if (val === "full" && this.pageURLs[index].url !== "") {
            try {
              var url = new URL(this.pageURLs[index].url);
              if (!url.pathname) {
                this.pageURLs[index].url = ""
              }
            } catch (error) {
              this.pageURLs[index].url = ""
              console.error("changeActionURLType -> error", error)
            }
          }
        }
      }
    },

    /**________________ URL Fields _______________________________ */

    /**
     * Add New URL Field [comma ,,]
     * @param {number} urlIndex
     */
    addNewURLField(urlIndex) {
      if (urlIndex === undefined || urlIndex === null || urlIndex === "") {
        return false;
      }

      if (
        typeof this.pageURLs === "object" &&
        this.pageURLs[urlIndex] !== undefined
      ) {
        this.$buefy.dialog.prompt({
          message: `Field's Name`,
          inputAttrs: {
            placeholder: "Enter Field's Name"
          },
          trapFocus: true,
          onConfirm: value => {
            var field = value.split(",");
            if (field.length > 0) {
              for (const fieldName of field) {
                if (fieldName !== "" && fieldName !== null) {
                  // Check Field Name Exists
                  if (this.pageURLs[urlIndex].field[fieldName] === undefined) {
                    // TODO: New Field Key
                    var newField = {
                      name: fieldName,
                      elmID: fieldName,
                      elmType: "querySelector",
                      script: "",
                      isRunScript: false,
                      isActive: true,
                      // Field Actions
                      actions: [],
                      actionName: [],
                    };

                    // Set New Field in the Object
                    this.$set(
                      this.pageURLs[urlIndex].field,
                      fieldName,
                      newField
                    );
                  } else {
                    this.$buefy.toast.open({
                      message: `This field already exists in the url field data.`,
                      position: "is-bottom",
                      type: "is-danger"
                    });
                  }
                }
              }
            }
          }
        });
      }
    },

    /**
     * Delete Page URL Fields (all|index)
     * @param {number|String} index
     */
    deleteURLField(index) {
      if (index === undefined || index === null || index === "") {
        return false;
      }

      // Delete Page URL Field with 'all' and array index
      if (index === "all") {
        this.$buefy.dialog.confirm({
          title: "Deleting All Page URL Fields",
          message:
            "Are you sure you want to <b>delete</b> all page url fields? This action cannot be undone.",
          confirmText: "Delete",
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => {
            if (
              this.urlIndexForFieldTab !== false &&
              this.pageURLs[this.urlIndexForFieldTab] !== undefined
            )
              this.pageURLs[this.urlIndexForFieldTab].field = {};
          }
        });
      } else {
        this.$buefy.dialog.confirm({
          title: "Deleting Page URL Field",
          message:
            "Are you sure you want to <b>delete</b> this page url field data? This action cannot be undone.",
          confirmText: "Delete",
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => {
            if (
              this.urlIndexForFieldTab !== false &&
              this.pageURLs[this.urlIndexForFieldTab] !== undefined
            ) {
              if (this.pageURLs[this.urlIndexForFieldTab].field !== undefined) {
                this.$delete(
                  this.pageURLs[this.urlIndexForFieldTab].field,
                  index
                );
              }
            }
          }
        });
      }
    },

    /**
     * Open Field Action Page
     * @param {number} urlIndex
     * @param {String} fieldIndex
     */
    openFieldActionPage(urlIndex, fieldIndex) {
      var url =
        "fieldAction.html?url=" +
        encodeURIComponent(urlIndex) +
        "&field=" +
        encodeURIComponent(fieldIndex);
      document.location.href = url;
    },

    /**________________ Backup Data _______________________________ */

    /**
     * Import Backup Data
     */
    importBackupData() {
      var that = this
      if (this.importJSONFile !== null && this.importJSONFile.type !== undefined) {
        if (this.importJSONFile.type === "application/json") {

          var reader = new FileReader();
          reader.onload = function (e) {
            var data = e.target.result;
            if (data !== undefined && data !== "") {
              var jsonData = JSON.parse(data);
              if (jsonData !== "" && jsonData !== null && Object.keys(jsonData).length > 0) {

                // Import JSON Data in the Vue js Variable
                that.pageURLs = jsonData

              } else {
                that.importJSONFile = null
                that.$buefy.toast.open({
                  message: `Backup JSON Data Not Found!`,
                  type: 'is-danger'
                })
              }

            } else {
              that.importJSONFile = null
              that.$buefy.toast.open({
                message: `File Data Not Found!`,
                type: 'is-danger'
              })
            }
          }
  
          reader.readAsBinaryString(this.importJSONFile);
        } else {
          this.importJSONFile = null
        }
      } else {
        this.importJSONFile = null
      }
    },

    /**
     * Export Backup Data
     */
    exportBackupData() {
      // Current DateTime
      var dateObj = new Date();
      var date = dateObj.getDate() + "-"+ dateObj.getMonth() + "-"+ dateObj.getFullYear() +"-"+ dateObj.getHours() +"-"+ dateObj.getMinutes() +"-"+ dateObj.getSeconds();
      // Download
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.pageURLs));
      var dlAnchorElem = document.getElementById('exportJSONDataHref');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "form-controller-" + date + ".json");
      dlAnchorElem.click();
    },
  },

  watch: {
    // Active Tab Index
    activeTabIndex: function(newValue) {
      this.setValueINExtensionStorage(newValue, "tabVal__activeTabIndex");
    },

    // URL Index Field
    urlIndexForFieldTab: function(newValue) {
      this.setValueINExtensionStorage(newValue, "tabVal__urlIndexForFieldTab");
    },

    // Page URL's Data
    pageURLs: {
      handler: function(newObject) {
        this.setValueINExtensionStorage(newObject, "objectVal__pageURLs");
      },
      deep: true
    }
  },

  created() {
    var that = this;

    // Active Tab Index
    chrome.storage.local.get("tabVal__activeTabIndex", function(budget) {
      if (budget.tabVal__activeTabIndex != undefined)
        that.activeTabIndex = budget.tabVal__activeTabIndex;
    });

    this.setDataINVariable("objectVal__pageURLs", "pageURLs");
    this.setDataINVariable("tabVal__urlIndexForFieldTab", "urlIndexForFieldTab");
  }
};
</script>