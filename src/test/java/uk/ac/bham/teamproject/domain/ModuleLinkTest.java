package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class ModuleLinkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ModuleLink.class);
        ModuleLink moduleLink1 = new ModuleLink();
        moduleLink1.setId(1L);
        ModuleLink moduleLink2 = new ModuleLink();
        moduleLink2.setId(moduleLink1.getId());
        assertThat(moduleLink1).isEqualTo(moduleLink2);
        moduleLink2.setId(2L);
        assertThat(moduleLink1).isNotEqualTo(moduleLink2);
        moduleLink1.setId(null);
        assertThat(moduleLink1).isNotEqualTo(moduleLink2);
    }
}
