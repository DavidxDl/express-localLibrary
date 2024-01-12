const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = `${this.first_name} ${this.family_name}`;
  }

  return fullName;
});

AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
    DateTime.DATE_MED,
  );
});
AuthorSchema.virtual("date_of_birth_YYYY").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});
AuthorSchema.virtual("date_of_death_YYYY").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("lifespan").get(function () {
  const birth = this.date_of_birth;
  const death = this.date_of_death;
  const lifespan =
    death === undefined
      ? DateTime.fromJSDate(birth).toLocaleString(DateTime.DATE_MED)
      : DateTime.fromJSDate(birth).toLocaleString(DateTime.DATE_MED) +
        " - " +
        DateTime.fromJSDate(death).toLocaleString(DateTime.DATE_MED);

  return lifespan;
});

module.exports = mongoose.model("Author", AuthorSchema);
