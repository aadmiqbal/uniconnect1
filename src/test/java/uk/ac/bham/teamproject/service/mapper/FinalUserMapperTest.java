package uk.ac.bham.teamproject.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FinalUserMapperTest {

    private FinalUserMapper finalUserMapper;

    @BeforeEach
    public void setUp() {
        finalUserMapper = new FinalUserMapperImpl();
    }
}
