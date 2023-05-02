package fi.tuni.aaniohjaus

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class Address(var katu : String? = null,
                   var katunumero : String? = null,
                   var postinumero : String? = null,
                   var kunta : String? = null) {

    fun roadWithHouseNumber() : String {
        return "${this.katu} ${this.katunumero},"
    }

    fun postCodeWithCity() : String {
        return "${this.postinumero}, ${this.kunta}"
    }

    fun separatePostalCodeNumbers() : String {
        return this.postinumero!!.split("").joinToString(" ")
    }

    fun toStringWithPostalCodesSeparated() : String {
        return "${roadWithHouseNumber()}, ${separatePostalCodeNumbers()}, $kunta"
    }

    override fun toString() : String {
        return "${this.katu} ${this.katunumero}, ${this.postinumero}, ${this.kunta}"
    }
}