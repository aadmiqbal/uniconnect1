package uk.ac.bham.teamproject.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class FinalUserDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FinalUserDTO.class);
        FinalUserDTO finalUserDTO1 = new FinalUserDTO();
        finalUserDTO1.setId(1L);
        FinalUserDTO finalUserDTO2 = new FinalUserDTO();
        assertThat(finalUserDTO1).isNotEqualTo(finalUserDTO2);
        finalUserDTO2.setId(finalUserDTO1.getId());
        assertThat(finalUserDTO1).isEqualTo(finalUserDTO2);
        finalUserDTO2.setId(2L);
        assertThat(finalUserDTO1).isNotEqualTo(finalUserDTO2);
        finalUserDTO1.setId(null);
        assertThat(finalUserDTO1).isNotEqualTo(finalUserDTO2);
    }
}
