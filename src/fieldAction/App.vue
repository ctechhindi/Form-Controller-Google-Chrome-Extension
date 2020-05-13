<template>
  <div class="fieldAction">
    <!-- Header -->
    <Header />

    <!-- Page Content -->
    <div class="container-full-width" v-if="activeURLIndex !== false && activeURLFieldIndex !== false">
      <b-tabs position="is-centered" expanded class="block" v-if="pageURLs[activeURLIndex]">

        <!-- Field Actions -->
        <b-tab-item label="Field Actions" icon="gesture-double-tap">
          <div class="container">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <div>
                    <p class="title is-5" style="margin-bottom: 5px;">URL: 
                      <code style="font: icon; font-weight: 400; margin-left: 10px;">{{ pageURLs[activeURLIndex].url }}</code>
                    </p>
                    <p class="title is-5">Field: 
                      <code style="font: icon; font-weight: 400; margin-left: 3px;">{{ activeURLFieldIndex }}</code>
                    </p>
                  </div>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <b-tooltip label="Add New Action" type="is-success" position="is-top">
                    <b-button type="is-success" icon-left="plus" @click="openFieldActionModel()"></b-button>
                  </b-tooltip>
                  <b-tooltip
                    type="is-danger"
                    label="Delete All Field Actions"
                    style="margin-left: 5px;"
                  >
                    <b-button type="is-danger" icon-left="delete" @click="deleteFieldAction('allAction')"></b-button>
                  </b-tooltip>
                </div>
              </div>
            </nav>
            <!-- Field Action -->
            <div
              class="container"
              v-if="activeURLIndex !== false && pageURLs[activeURLIndex] && pageURLs[activeURLIndex].field[activeURLFieldIndex]"
            >
              <!-- URL Field Data -->
              <table
                class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
                v-if="Object.keys(pageURLs[activeURLIndex].field[activeURLFieldIndex].actions).length > 0"
              >
                <thead>
                  <th></th>
                  <th>ON/OFF</th>
                  <th>Action Label</th>
                  <th>Action Name</th>
                  <th>Action Value</th>
                  <th>setTimeout</th>
                  <th>Action</th>
                </thead>
                <draggable tag="tbody" v-model="pageURLs[activeURLIndex].field[activeURLFieldIndex].actions" handle=".handle" @start="drag=true" @end="drag=false">
                  <tr v-for="(data, index) in pageURLs[activeURLIndex].field[activeURLFieldIndex].actions" :key="index">
                    <td style="width: 60px;">
                      <b-button
                        type="is-warning"
                        size="is-small"
                        icon-right="cursor-move"
                        class="handle"
                        style="cursor: all-scroll;"
                      ></b-button>&nbsp;
                    </td>
                    <!-- Field ON/OFF -->
                    <td style="width: 100px;">
                      <div class="field" style="margin-top: 6px;">
                        <b-switch :value="true" type="is-success" v-model="data.isActive"></b-switch>
                      </div>
                    </td>
                    <td>{{ data.label }}</td>
                    <td>{{ data.name }}</td>
                    <td>{{ data.value }}</td>
                    <td>
                      <p v-show="data.setTimeout">{{ data.setTimeoutTime }}</p>
                    </td>
                    <!-- Action -->
                    <td style="width: 200px;">
                      <b-tooltip type="is-success" label="Edit Field Action">
                        <b-button
                          type="is-success"
                          icon-left="pencil"
                          @click="openFieldActionModel(index)"
                        ></b-button>
                      </b-tooltip>&nbsp;
                      <b-tooltip type="is-danger" label="Delete URL Field">
                        <b-button
                          type="is-danger"
                          icon-left="delete"
                          @click="deleteFieldAction(index)"
                        ></b-button>
                      </b-tooltip>
                    </td>
                  </tr>
                </draggable>
              </table>
              <!-- Data not found! -->
              <table v-else class="table is-bordered is-fullwidth">
                <tr>
                  <td class="has-text-centered">
                    <p class="has-text-danger is-size-3">Not Data Found!</p>
                    <p class="has-text-link is-size-6 is-family-code">Action data not found.</p>
                  </td>
                </tr>
              </table>
            </div>
            <!-- Data not found! -->
            <div class="container" v-else>
              <table class="table is-bordered is-fullwidth">
                <tr>
                  <td class="has-text-centered">
                    <p class="has-text-danger is-size-3">ACTION DATA NOT FOUND.</p>
                    <p class="has-text-link is-size-6 is-family-code">Action data not found.</p>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </b-tab-item>

        <!-- Field JS Script -->
        <b-tab-item label="Custom JS Script" icon="nodejs" v-if="pageURLs[activeURLIndex].field[activeURLFieldIndex]">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <p class="title is-5">
                  <b-icon icon="nodejs"></b-icon>&nbsp; Custom JS Script For Field: &nbsp;
                  <code>{{ activeURLFieldIndex }}</code>
                </p>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-tooltip label="Script ON/OFF" type="is-success" position="is-left">
                  <div class="field" style="margin-top: 6px;">
                    <b-switch :value="true" type="is-success" v-model="pageURLs[activeURLIndex].field[activeURLFieldIndex].isRunScript">ON/OFF</b-switch>
                  </div>
                </b-tooltip>
              </div>
            </div>
          </nav>
          <codemirror v-model="jsEditor.code" :options="jsEditor.options" />
          <nav class="level" style="margin: 10px 0px 0px">
            <div class="level-left">
              <div class="level-item">
                <b-button type="is-success" icon-left="content-save" @click="saveFieldScriptCode()">Save Script</b-button>
              </div>
            </div>
            <div class="level-right"></div>
          </nav>
        </b-tab-item>
      </b-tabs>
    </div>

    <!-- Action: Model -->
    <div class="container">
      <b-modal :active.sync="actionModel.isOpen" :width="640" scroll="keep">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              <b-icon icon="gesture-double-tap" size="is-small"></b-icon>&nbsp;Field Action
            </p>
          </header>
          <section class="modal-card-body">
            <!-- Action Name -->
            <b-field label="Action Name">
              <b-select placeholder="Select a field action" v-model="actionModel.name" @input="setActionValue" expanded>
                <option value>-- Select a field action --</option>
                <option
                  v-for="option in fieldActions"
                  :value="option.value"
                  :key="option.value"
                >{{ option.name }}</option>
              </b-select>
            </b-field>
            <!-- Action Value -->
            <b-field label="Action Value" v-if="actionModel.value !== false">
              <b-input v-model="actionModel.value" placeholder="Enter Action Value"></b-input>
            </b-field>
            <!-- Extra Options -->
            <div v-if="Object.keys(actionModel.extraOptions).length > 0">
              <strong>Extra Options</strong>
              <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" style="margin: 5px; 0px 5px">
                <thead>
                  <th>Key</th>
                  <th>Value</th>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in  actionModel.extraOptions" :key="index">
                    <td>
                      <b-tooltip position="is-right" :label="item.label">{{ item.key }}</b-tooltip>
                    </td>
                    <td>
                      <b-input v-model="item.value" placeholder="Enter Key Value" size="is-small" expanded></b-input>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Other Options -->
            <b-field label="Other Options"></b-field>
            <!-- Check Mode -->
            <b-field>
              <p class="control">
                <b-checkbox-button v-model="actionModel.checkMode" :native-value="true" type="is-warning">
                  <b-icon icon="equal"></b-icon>
                  <span>Check Mode</span>
                </b-checkbox-button>
              </p>
              <b-input v-show="actionModel.checkMode" v-model="actionModel.emptyValue" placeholder="Enter Field Empty Value" expanded></b-input>
            </b-field>
            <!-- setTimeout -->
            <b-field>
              <p class="control">
                <b-checkbox-button v-model="actionModel.setTimeout" :native-value="true">
                  <b-icon icon="clock-outline"></b-icon>
                  <span style="padding-right: 7px;">setTimeout</span>
                </b-checkbox-button>
              </p>
              <b-input v-show="actionModel.setTimeout" type="number" v-model="actionModel.setTimeoutTime" placeholder="Enter Time Millisecond" expanded></b-input>
            </b-field>
            <!-- Active -->
            <b-field>
              <p class="control">
                <b-checkbox-button v-model="actionModel.isActive" :native-value="true" type="is-success">
                  <b-icon v-if="actionModel.isActive" icon="play"></b-icon>
                  <b-icon v-else icon="stop"></b-icon>
                  <span style="padding-right: 40px;">{{ (actionModel.isActive === true)? "Active":"Inactive" }}</span>
                </b-checkbox-button>
              </p>
              <b-input v-show="false" expanded></b-input>
            </b-field>
            <!-- Events -->
            <b-field>
              <p class="control">
                <b-checkbox-button v-model="actionModel.isEvent" :native-value="true" type="is-dark">
                  <b-icon icon="calendar-text"></b-icon>
                  <span style="padding-right: 38px;">&nbsp; Events</span>
                </b-checkbox-button>
              </p>
              <b-taginput v-show="actionModel.isEvent" @typing="getFilteredEvents" v-model="actionModel.events" :data="javascriptEventList" :open-on-focus="true" type="is-dark" style="width: 100%;" dropdown-position="top" placeholder="Search and Select Event" autocomplete></b-taginput>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-primary" @click="saveFieldAction">Save Action</button>
          </footer>
        </div>
      </b-modal>
    </div>

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

import draggable from "vuedraggable";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import mixin from "@/mixins/global";

export default {
  name: "FieldAction",
  mixins: [mixin],
  components: { Header, Footer, draggable },
  data() {
    return {
      // URLs Data
      pageURLs: [],
      // Active URL Index
      activeURLIndex: false,
      // Active URL Field Index
      activeURLFieldIndex: false,
      // Action Model Data
      actionModel: {
        isOpen: false,
        actionIndex: false,
        name: "", // Action Name
        label: "", // Action Label
        value: "", // Action Value
        checkMode: false, // Check Mode
        emptyValue: "", // Empty Value
        setTimeout: false, // setTimeout
        setTimeoutTime: 100, // setTimeout Time Millisecond
        isActive: true, // Active
        extraOptions: {}, // Action Extra Options
        isEvent: false, // Action Event
        events: [], // Action Event Names
      },
      // JS Events: My Event ("force")
      javascriptEventList: ["click", "dblclick", "change", "copy", "cut", "paste", "submit", "focus", "focusin", "focusout", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseup", "mouseover", "mouseout", "input", "keydown", "keypress", "keyup", "load", "unload", "force"],
      javascriptEventListFilter: ["click", "dblclick", "change", "copy", "cut", "paste", "submit", "focus", "focusin", "focusout", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseup", "mouseover", "mouseout", "input", "keydown", "keypress", "keyup", "load", "unload", "force"],
      // Field Action's Data
      fieldActions: {
        // Update: Characters
        "default_value": { name: "Default Value", value: "default_value" },
        "click": { name: "Click", value: "click" },
        "krutidevToUnicode": { name: "Convert Kruti Dev Font to Unicode", value: "krutidevToUnicode" },
        "unicodeToKrutidev": { name: "Convert Unicode to Kruti Dev Font", value: "unicodeToKrutidev" },
        "copyTo": { name: "Copy Value For Other Element", value: "copyTo" },
        "decode_captcha": { name: "Decode Captcha", value: "decode_captcha" },
        "char_lowercase": { name: "Lowercase Characters", value: "char_lowercase" },
        "char_uppercase": { name: "Uppercase Characters", value: "char_uppercase" },
        "char_camelcase": { name: "CamelCase Characters", value: "char_camelcase" },
        "remove_whitespace": { name: "Remove Whitespace", value: "remove_whitespace" },
        "remove_allSpace": { name: "Remove All Space", value: "remove_allSpace" },
      },
      // Field JS Script
      jsEditor: {
        code: "",
        options: {
          tabSize: 2,
          mode: "text/javascript",
          theme: "monokai",
          lineNumbers: true,
          line: true
        }
      },
    };
  },
  methods: {
    /**
     * Fetch Get Param in the Current URL
     */
    fetchParamInURL() {
      var url = new URL(window.location.href);
      var urlIndex = url.searchParams.get("url");
      var fieldKey = url.searchParams.get("field");

      if (urlIndex !== undefined && urlIndex !== null && urlIndex !== "") {
        if (fieldKey !== undefined && fieldKey !== null && fieldKey !== "") {
          if (
            this.pageURLs.length > 0 &&
            this.pageURLs[urlIndex] !== undefined
          ) {
            if (
              this.pageURLs[urlIndex].field !== undefined &&
              Object.keys(this.pageURLs[urlIndex].field).length > 0
            ) {
              if (this.pageURLs[urlIndex].field[fieldKey] !== undefined) {
                this.activeURLIndex = urlIndex;
                this.activeURLFieldIndex = fieldKey;

                return true;
              }
            }
          }
        }
      }
      return (document.location.href = "options.html");
    },

    /**
     * Open Action Model
     */
    openFieldActionModel(index = false) {
      if (this.activeURLIndex === false || this.activeURLFieldIndex === false) {
        return false;
      }

      if (index === false) {

        // Empty Action Data in the Model
        this.actionModel.actionIndex = false
        this.actionModel.name = ""
        this.actionModel.label = ""
        this.actionModel.value = false
        this.actionModel.checkMode = false
        this.actionModel.isActive = true
        this.actionModel.extraOptions = {}
        // setTimeout
        this.actionModel.setTimeout = false
        this.actionModel.setTimeoutTime = 100
        // JS Events
        this.actionModel.isEvent = false;
        this.actionModel.events = [];

        // Action Model Open
        this.actionModel.isOpen = true;

      } else {
        // Edit Model
        if (this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex].actions !== undefined) {
          var fieldAction = this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex].actions[index];
          
          // Fill Action Data in the Model
          this.actionModel.actionIndex = index
          this.actionModel.name = fieldAction.name
          this.actionModel.label = fieldAction.label
          this.actionModel.value = fieldAction.value
          this.actionModel.checkMode = fieldAction.checkMode
          this.actionModel.isActive = fieldAction.isActive
          this.actionModel.extraOptions = fieldAction.extraOptions
          this.actionModel.setTimeout = fieldAction.setTimeout
          this.actionModel.setTimeoutTime = fieldAction.setTimeoutTime
          this.actionModel.isEvent = fieldAction.isEvent
          this.actionModel.events = fieldAction.events

          setTimeout(() => {
            // Action Model Open
            this.actionModel.isOpen = true;
          }, 100);
        }
      }
    },

    /**
     * Save/Update Field Action
     */
    saveFieldAction() {
      if (this.activeURLIndex === false || this.activeURLFieldIndex === false) {
        return false;
      }

      if (!this.actionModel.name) {
        this.$buefy.toast.open({
          message: `Please select field action name`,
          position: 'is-bottom',
          type: 'is-danger'
        });
      }

      // Check Data in Validation
      if (this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex] !== undefined) {
        var fieldData = this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex];

        // Action Data
        var action = {
          name: this.actionModel.name,
          // Fetch Action Label
          label: this.fieldActions[this.actionModel.name].name,
          value: this.actionModel.value,
          checkMode: this.actionModel.checkMode,
          // Field Empty Value
          emptyValue: this.actionModel.emptyValue,
          // setTimeout
          setTimeout: this.actionModel.setTimeout,
          setTimeoutTime: this.actionModel.setTimeoutTime,
          // Active
          isActive: this.actionModel.isActive,
          // Extra Options
          extraOptions: this.actionModel.extraOptions,
          // JS Events
          isEvent: this.actionModel.isEvent,
          events: this.actionModel.events,
        };

        // Check Action Name is Exists
        if (fieldData.actionName.indexOf(this.actionModel.name) < 0) {

          // Save New Action
          fieldData.actions.push(action);
          fieldData.actionName.push(this.actionModel.name);

          this.$buefy.toast.open({
            message: `The field action has been successfully saved.`,
            position: 'is-bottom',
            type: 'is-success'
          });
         
        } else {

          if (actionIndex !== false) {
            var actionIndex = this.actionModel.actionIndex;

            if (fieldData.actions[actionIndex].name !== this.actionModel.name) {
              this.$buefy.toast.open({
                message: `Field action name do not change.`,
                position: 'is-bottom',
                type: 'is-danger'
              });
            }

            // Update Action
            this.$set(fieldData.actions[actionIndex], "name", this.actionModel.name);
            this.$set(fieldData.actions[actionIndex], "label", this.fieldActions[this.actionModel.name].name);
            this.$set(fieldData.actions[actionIndex], "value", this.actionModel.value);
            this.$set(fieldData.actions[actionIndex], "checkMode", this.actionModel.checkMode);
            this.$set(fieldData.actions[actionIndex], "emptyValue", this.actionModel.emptyValue);
            this.$set(fieldData.actions[actionIndex], "setTimeout", this.actionModel.setTimeout);
            this.$set(fieldData.actions[actionIndex], "setTimeoutTime", this.actionModel.setTimeoutTime);
            this.$set(fieldData.actions[actionIndex], "isActive", this.actionModel.isActive);
            this.$set(fieldData.actions[actionIndex], "extraOptions", this.actionModel.extraOptions);
            this.$set(fieldData.actions[actionIndex], "isEvent", this.actionModel.isEvent);
            this.$set(fieldData.actions[actionIndex], "events", this.actionModel.events);
          }
        }

        setTimeout(() => {
          // Close Action Model
          this.actionModel.isOpen = false
        }, 100);
      }
    },

    /**
     * Delete Field Action
     * @param {String} actionIndex {allAction}
     */
    deleteFieldAction(actionIndex) {
      if (this.activeURLIndex === false || this.activeURLFieldIndex === false) {
        return false;
      }
      
      // Check Data in Validation
      if (
        this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex] !==
        undefined
      ) {
        var fieldData = this.pageURLs[this.activeURLIndex].field[
          this.activeURLFieldIndex
        ];

        if (actionIndex !== "allAction") {
          if (fieldData.actions !== undefined && fieldData.actions[actionIndex] !== undefined) {
            // Delete Action Name
            var fieldIndex = fieldData.actionName.indexOf(fieldData.actions[actionIndex].name);
            fieldData.actionName.splice(fieldIndex, 1);
            // Delete Action Array
            this.$delete(fieldData.actions, actionIndex);
          }
        } else {
          this.$buefy.dialog.confirm({
            title: "Deleting All Field Actions",
            message:
              "Are you sure you want to <b>delete</b> all field action? This action cannot be undone.",
            confirmText: "Delete",
            type: "is-danger",
            hasIcon: true,
            onConfirm: () => {
              // Delete all field actions
              fieldData.actions = [];
              fieldData.actionName = [];
            }
          });
          
        }
      }
    },

    /**
     * Set Action Value For Action Name
     */
    setActionValue(actionName) {
      if (actionName === "decode_captcha") {
        this.actionModel.value = false;
        // Insert: Action Extra Options
        this.actionModel.extraOptions = {
          apikey: {key: "apikey", value: "", label: "API Key for Request"},
          imgElm: {key: "imgElm", value: "", label: "Captcha Image Element ID"}
        };
        
      } else if (actionName == "copyTo") {

        this.actionModel.value = false;
        // Insert: Action Extra Options
        this.actionModel.extraOptions = {
          copyElm: {key: "copyElm", value: "", label: "Copy Element ID"}
        };

      } else if (actionName === "default_value") {
        this.actionModel.value = "";
        this.actionModel.extraOptions = {};
      } else {
        this.actionModel.value = false;
        this.actionModel.extraOptions = {};
      }
    },

    /**
     * Get/Filter Action Event Names
     */
    getFilteredEvents(text) {
      this.javascriptEventList = this.javascriptEventListFilter.filter((option) => {
        return option.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
      });
    },

    /** _________________ Field JS Script ______________________________ */

    /**
     * Set Field JS Script Code in the Editor
     */
    setFieldScriptCode() {
      if (this.activeURLIndex === false || this.activeURLFieldIndex === false) {
        return false;
      }

      // Check Data in Validation
      if (this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex] !== undefined) {
        var fieldData = this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex];

        // Set Field JS Script Data in the Editor
        this.jsEditor.code = fieldData.script
      }
    },

    /**
     * Save Field JS Script Code
     */
    saveFieldScriptCode() {
      if (this.activeURLIndex === false || this.activeURLFieldIndex === false) {
        return false;
      }

      // Check Data in Validation
      if (this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex] !== undefined) {
        var fieldData = this.pageURLs[this.activeURLIndex].field[this.activeURLFieldIndex];

        // Set 
        this.$set(fieldData, "script", this.jsEditor.code)

        this.$buefy.toast.open({
          message: `Custom JS Script Saved.`,
          position: "is-bottom",
          type: "is-success"
        });
      }
    }
  },
  watch: {
    // Page URL's Data
    pageURLs: {
      handler: function(newObject) {
        this.setValueINExtensionStorage(newObject, "objectVal__pageURLs");
      },
      deep: true
    }
  },
  created() {
    this.setDataINVariable("objectVal__pageURLs", "pageURLs").then(res => {
      if (res.status === true) {
        // {@call}
        this.fetchParamInURL();
        // {@call}
        this.setFieldScriptCode();
      }
    });
  }
};
</script>