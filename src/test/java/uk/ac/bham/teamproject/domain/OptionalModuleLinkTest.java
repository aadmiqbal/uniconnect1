package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class OptionalModuleLinkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OptionalModuleLink.class);
        OptionalModuleLink optionalModuleLink1 = new OptionalModuleLink();
        optionalModuleLink1.setId(1L);
        OptionalModuleLink optionalModuleLink2 = new OptionalModuleLink();
        optionalModuleLink2.setId(optionalModuleLink1.getId());
        assertThat(optionalModuleLink1).isEqualTo(optionalModuleLink2);
        optionalModuleLink2.setId(2L);
        assertThat(optionalModuleLink1).isNotEqualTo(optionalModuleLink2);
        optionalModuleLink1.setId(null);
        assertThat(optionalModuleLink1).isNotEqualTo(optionalModuleLink2);
    }
}
