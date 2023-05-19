package fi.tuni.aaniohjaus

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

/**
 * Represents an address.
 *
 * @property katu The name of the street.
 * @property katunumero The house number on the street.
 * @property postinumero The postal code.
 * @property kunta The municipality or city name.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class Address(var katu : String? = null,
                   var katunumero : String? = null,
                   var postinumero : String? = null,
                   var kunta : String? = null) {

    /**
     * Generates a formatted string representation of the road with the house number.
     *
     * @return The formatted string.
     */
    fun roadWithHouseNumber() : String {
        return "${this.katu} ${this.katunumero},"
    }

    /**
     * Generates a formatted string representation of the postal code with the city.
     *
     * @return The formatted string.
     */
    fun postCodeWithCity() : String {
        return "${this.postinumero}, ${this.kunta}"
    }

    /**
     * Separates the postal code numbers with spaces.
     *
     * @return The formatted string with separated postal code numbers.
     */
    private fun separatePostalCodeNumbers() : String {
        return this.postinumero!!.split("").joinToString(" ")
    }

    /**
     * Generates a formatted string representation of the address with separated postal code numbers.
     *
     * @return The formatted string.
     */
    fun toStringWithPostalCodesSeparated() : String {
        return "${roadWithHouseNumber()}, ${separatePostalCodeNumbers()}, $kunta"
    }
}