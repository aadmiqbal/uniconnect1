package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.repository.FinalUserRepository;
import uk.ac.bham.teamproject.service.FinalUserService;
import uk.ac.bham.teamproject.service.criteria.FinalUserCriteria;
import uk.ac.bham.teamproject.service.dto.FinalUserDTO;
import uk.ac.bham.teamproject.service.mapper.FinalUserMapper;

/**
 * Integration tests for the {@link FinalUserResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FinalUserResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_STUDY_YEAR = 1;
    private static final Integer UPDATED_STUDY_YEAR = 2;
    private static final Integer SMALLER_STUDY_YEAR = 1 - 1;

    private static final String DEFAULT_BIO = "AAAAAAAAAA";
    private static final String UPDATED_BIO = "BBBBBBBBBB";

    private static final String DEFAULT_PFP = "AAAAAAAAAA";
    private static final String UPDATED_PFP = "BBBBBBBBBB";

    private static final String DEFAULT_MODULES = "AAAAAAAAAA";
    private static final String UPDATED_MODULES = "BBBBBBBBBB";

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/final-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FinalUserRepository finalUserRepository;

    @Mock
    private FinalUserRepository finalUserRepositoryMock;

    @Autowired
    private FinalUserMapper finalUserMapper;

    @Mock
    private FinalUserService finalUserServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFinalUserMockMvc;

    private FinalUser finalUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinalUser createEntity(EntityManager em) {
        FinalUser finalUser = new FinalUser()
            .name(DEFAULT_NAME)
            .studyYear(DEFAULT_STUDY_YEAR)
            .bio(DEFAULT_BIO)
            .pfp(DEFAULT_PFP)
            .modules(DEFAULT_MODULES)
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        finalUser.setUser(user);
        return finalUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinalUser createUpdatedEntity(EntityManager em) {
        FinalUser finalUser = new FinalUser()
            .name(UPDATED_NAME)
            .studyYear(UPDATED_STUDY_YEAR)
            .bio(UPDATED_BIO)
            .pfp(UPDATED_PFP)
            .modules(UPDATED_MODULES)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        finalUser.setUser(user);
        return finalUser;
    }

    @BeforeEach
    public void initTest() {
        finalUser = createEntity(em);
    }

    @Test
    @Transactional
    void createFinalUser() throws Exception {
        int databaseSizeBeforeCreate = finalUserRepository.findAll().size();
        // Create the FinalUser
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);
        restFinalUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finalUserDTO)))
            .andExpect(status().isCreated());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeCreate + 1);
        FinalUser testFinalUser = finalUserList.get(finalUserList.size() - 1);
        assertThat(testFinalUser.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFinalUser.getStudyYear()).isEqualTo(DEFAULT_STUDY_YEAR);
        assertThat(testFinalUser.getBio()).isEqualTo(DEFAULT_BIO);
        assertThat(testFinalUser.getPfp()).isEqualTo(DEFAULT_PFP);
        assertThat(testFinalUser.getModules()).isEqualTo(DEFAULT_MODULES);
        assertThat(testFinalUser.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testFinalUser.getLastName()).isEqualTo(DEFAULT_LAST_NAME);

        // Validate the id for MapsId, the ids must be same
        assertThat(testFinalUser.getId()).isEqualTo(finalUserDTO.getUser().getId());
    }

    @Test
    @Transactional
    void createFinalUserWithExistingId() throws Exception {
        // Create the FinalUser with an existing ID
        finalUser.setId(1L);
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);

        int databaseSizeBeforeCreate = finalUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFinalUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finalUserDTO)))
            .andExpect(status().isBadRequest());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void updateFinalUserMapsIdAssociationWithNewId() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);
        int databaseSizeBeforeCreate = finalUserRepository.findAll().size();
        // Add a new parent entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();

        // Load the finalUser
        FinalUser updatedFinalUser = finalUserRepository.findById(finalUser.getId()).get();
        assertThat(updatedFinalUser).isNotNull();
        // Disconnect from session so that the updates on updatedFinalUser are not directly saved in db
        em.detach(updatedFinalUser);

        // Update the User with new association value
        updatedFinalUser.setUser(user);
        FinalUserDTO updatedFinalUserDTO = finalUserMapper.toDto(updatedFinalUser);
        assertThat(updatedFinalUserDTO).isNotNull();

        // Update the entity
        restFinalUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFinalUserDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFinalUserDTO))
            )
            .andExpect(status().isOk());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeCreate);
        FinalUser testFinalUser = finalUserList.get(finalUserList.size() - 1);
        // Validate the id for MapsId, the ids must be same
        // Uncomment the following line for assertion. However, please note that there is a known issue and uncommenting will fail the test.
        // Please look at https://github.com/jhipster/generator-jhipster/issues/9100. You can modify this test as necessary.
        // assertThat(testFinalUser.getId()).isEqualTo(testFinalUser.getUser().getId());
    }

    @Test
    @Transactional
    void getAllFinalUsers() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList
        restFinalUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finalUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].studyYear").value(hasItem(DEFAULT_STUDY_YEAR)))
            .andExpect(jsonPath("$.[*].bio").value(hasItem(DEFAULT_BIO)))
            .andExpect(jsonPath("$.[*].pfp").value(hasItem(DEFAULT_PFP)))
            .andExpect(jsonPath("$.[*].modules").value(hasItem(DEFAULT_MODULES)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFinalUsersWithEagerRelationshipsIsEnabled() throws Exception {
        when(finalUserServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFinalUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(finalUserServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFinalUsersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(finalUserServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFinalUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(finalUserRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getFinalUser() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get the finalUser
        restFinalUserMockMvc
            .perform(get(ENTITY_API_URL_ID, finalUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(finalUser.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.studyYear").value(DEFAULT_STUDY_YEAR))
            .andExpect(jsonPath("$.bio").value(DEFAULT_BIO))
            .andExpect(jsonPath("$.pfp").value(DEFAULT_PFP))
            .andExpect(jsonPath("$.modules").value(DEFAULT_MODULES))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME));
    }

    @Test
    @Transactional
    void getFinalUsersByIdFiltering() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        Long id = finalUser.getId();

        defaultFinalUserShouldBeFound("id.equals=" + id);
        defaultFinalUserShouldNotBeFound("id.notEquals=" + id);

        defaultFinalUserShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultFinalUserShouldNotBeFound("id.greaterThan=" + id);

        defaultFinalUserShouldBeFound("id.lessThanOrEqual=" + id);
        defaultFinalUserShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllFinalUsersByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where name equals to DEFAULT_NAME
        defaultFinalUserShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the finalUserList where name equals to UPDATED_NAME
        defaultFinalUserShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByNameIsInShouldWork() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where name in DEFAULT_NAME or UPDATED_NAME
        defaultFinalUserShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the finalUserList where name equals to UPDATED_NAME
        defaultFinalUserShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where name is not null
        defaultFinalUserShouldBeFound("name.specified=true");

        // Get all the finalUserList where name is null
        defaultFinalUserShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalUsersByNameContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where name contains DEFAULT_NAME
        defaultFinalUserShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the finalUserList where name contains UPDATED_NAME
        defaultFinalUserShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByNameNotContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where name does not contain DEFAULT_NAME
        defaultFinalUserShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the finalUserList where name does not contain UPDATED_NAME
        defaultFinalUserShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByStudyYearIsEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where studyYear equals to DEFAULT_STUDY_YEAR
        defaultFinalUserShouldBeFound("studyYear.equals=" + DEFAULT_STUDY_YEAR);

        // Get all the finalUserList where studyYear equals to UPDATED_STUDY_YEAR
        defaultFinalUserShouldNotBeFound("studyYear.equals=" + UPDATED_STUDY_YEAR);
    }

    @Test
    @Transactional
    void getAllFinalUsersByStudyYearIsInShouldWork() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where studyYear in DEFAULT_STUDY_YEAR or UPDATED_STUDY_YEAR
        defaultFinalUserShouldBeFound("studyYear.in=" + DEFAULT_STUDY_YEAR + "," + UPDATED_STUDY_YEAR);

        // Get all the finalUserList where studyYear equals to UPDATED_STUDY_YEAR
        defaultFinalUserShouldNotBeFound("studyYear.in=" + UPDATED_STUDY_YEAR);
    }

    @Test
    @Transactional
    void getAllFinalUsersByStudyYearIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where studyYear is not null
        defaultFinalUserShouldBeFound("studyYear.specified=true");

        // Get all the finalUserList where studyYear is null
        defaultFinalUserShouldNotBeFound("studyYear.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalUsersByStudyYearIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where studyYear is greater than or equal to DEFAULT_STUDY_YEAR
        defaultFinalUserShouldBeFound("studyYear.greaterThanOrEqual=" + DEFAULT_STUDY_YEAR);

        // Get all the finalUserList where studyYear is greater than or equal to UPDATED_STUDY_YEAR
        defaultFinalUserShouldNotBeFound("studyYear.greaterThanOrEqual=" + UPDATED_STUDY_YEAR);
    }

    @Test
    @Transactional
    void getAllFinalUsersByStudyYearIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where studyYear is less than or equal to DEFAULT_STUDY_YEAR
        defaultFinalUserShouldBeFound("studyYear.lessThanOrEqual=" + DEFAULT_STUDY_YEAR);

        // Get all the finalUserList where studyYear is less than or equal to SMALLER_STUDY_YEAR
        defaultFinalUserShouldNotBeFound("studyYear.lessThanOrEqual=" + SMALLER_STUDY_YEAR);
    }

    @Test
    @Transactional
    void getAllFinalUsersByStudyYearIsLessThanSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where studyYear is less than DEFAULT_STUDY_YEAR
        defaultFinalUserShouldNotBeFound("studyYear.lessThan=" + DEFAULT_STUDY_YEAR);

        // Get all the finalUserList where studyYear is less than UPDATED_STUDY_YEAR
        defaultFinalUserShouldBeFound("studyYear.lessThan=" + UPDATED_STUDY_YEAR);
    }

    @Test
    @Transactional
    void getAllFinalUsersByStudyYearIsGreaterThanSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where studyYear is greater than DEFAULT_STUDY_YEAR
        defaultFinalUserShouldNotBeFound("studyYear.greaterThan=" + DEFAULT_STUDY_YEAR);

        // Get all the finalUserList where studyYear is greater than SMALLER_STUDY_YEAR
        defaultFinalUserShouldBeFound("studyYear.greaterThan=" + SMALLER_STUDY_YEAR);
    }

    @Test
    @Transactional
    void getAllFinalUsersByBioIsEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where bio equals to DEFAULT_BIO
        defaultFinalUserShouldBeFound("bio.equals=" + DEFAULT_BIO);

        // Get all the finalUserList where bio equals to UPDATED_BIO
        defaultFinalUserShouldNotBeFound("bio.equals=" + UPDATED_BIO);
    }

    @Test
    @Transactional
    void getAllFinalUsersByBioIsInShouldWork() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where bio in DEFAULT_BIO or UPDATED_BIO
        defaultFinalUserShouldBeFound("bio.in=" + DEFAULT_BIO + "," + UPDATED_BIO);

        // Get all the finalUserList where bio equals to UPDATED_BIO
        defaultFinalUserShouldNotBeFound("bio.in=" + UPDATED_BIO);
    }

    @Test
    @Transactional
    void getAllFinalUsersByBioIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where bio is not null
        defaultFinalUserShouldBeFound("bio.specified=true");

        // Get all the finalUserList where bio is null
        defaultFinalUserShouldNotBeFound("bio.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalUsersByBioContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where bio contains DEFAULT_BIO
        defaultFinalUserShouldBeFound("bio.contains=" + DEFAULT_BIO);

        // Get all the finalUserList where bio contains UPDATED_BIO
        defaultFinalUserShouldNotBeFound("bio.contains=" + UPDATED_BIO);
    }

    @Test
    @Transactional
    void getAllFinalUsersByBioNotContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where bio does not contain DEFAULT_BIO
        defaultFinalUserShouldNotBeFound("bio.doesNotContain=" + DEFAULT_BIO);

        // Get all the finalUserList where bio does not contain UPDATED_BIO
        defaultFinalUserShouldBeFound("bio.doesNotContain=" + UPDATED_BIO);
    }

    @Test
    @Transactional
    void getAllFinalUsersByPfpIsEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where pfp equals to DEFAULT_PFP
        defaultFinalUserShouldBeFound("pfp.equals=" + DEFAULT_PFP);

        // Get all the finalUserList where pfp equals to UPDATED_PFP
        defaultFinalUserShouldNotBeFound("pfp.equals=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalUsersByPfpIsInShouldWork() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where pfp in DEFAULT_PFP or UPDATED_PFP
        defaultFinalUserShouldBeFound("pfp.in=" + DEFAULT_PFP + "," + UPDATED_PFP);

        // Get all the finalUserList where pfp equals to UPDATED_PFP
        defaultFinalUserShouldNotBeFound("pfp.in=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalUsersByPfpIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where pfp is not null
        defaultFinalUserShouldBeFound("pfp.specified=true");

        // Get all the finalUserList where pfp is null
        defaultFinalUserShouldNotBeFound("pfp.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalUsersByPfpContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where pfp contains DEFAULT_PFP
        defaultFinalUserShouldBeFound("pfp.contains=" + DEFAULT_PFP);

        // Get all the finalUserList where pfp contains UPDATED_PFP
        defaultFinalUserShouldNotBeFound("pfp.contains=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalUsersByPfpNotContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where pfp does not contain DEFAULT_PFP
        defaultFinalUserShouldNotBeFound("pfp.doesNotContain=" + DEFAULT_PFP);

        // Get all the finalUserList where pfp does not contain UPDATED_PFP
        defaultFinalUserShouldBeFound("pfp.doesNotContain=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalUsersByModulesIsEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where modules equals to DEFAULT_MODULES
        defaultFinalUserShouldBeFound("modules.equals=" + DEFAULT_MODULES);

        // Get all the finalUserList where modules equals to UPDATED_MODULES
        defaultFinalUserShouldNotBeFound("modules.equals=" + UPDATED_MODULES);
    }

    @Test
    @Transactional
    void getAllFinalUsersByModulesIsInShouldWork() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where modules in DEFAULT_MODULES or UPDATED_MODULES
        defaultFinalUserShouldBeFound("modules.in=" + DEFAULT_MODULES + "," + UPDATED_MODULES);

        // Get all the finalUserList where modules equals to UPDATED_MODULES
        defaultFinalUserShouldNotBeFound("modules.in=" + UPDATED_MODULES);
    }

    @Test
    @Transactional
    void getAllFinalUsersByModulesIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where modules is not null
        defaultFinalUserShouldBeFound("modules.specified=true");

        // Get all the finalUserList where modules is null
        defaultFinalUserShouldNotBeFound("modules.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalUsersByModulesContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where modules contains DEFAULT_MODULES
        defaultFinalUserShouldBeFound("modules.contains=" + DEFAULT_MODULES);

        // Get all the finalUserList where modules contains UPDATED_MODULES
        defaultFinalUserShouldNotBeFound("modules.contains=" + UPDATED_MODULES);
    }

    @Test
    @Transactional
    void getAllFinalUsersByModulesNotContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where modules does not contain DEFAULT_MODULES
        defaultFinalUserShouldNotBeFound("modules.doesNotContain=" + DEFAULT_MODULES);

        // Get all the finalUserList where modules does not contain UPDATED_MODULES
        defaultFinalUserShouldBeFound("modules.doesNotContain=" + UPDATED_MODULES);
    }

    @Test
    @Transactional
    void getAllFinalUsersByFirstNameIsEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where firstName equals to DEFAULT_FIRST_NAME
        defaultFinalUserShouldBeFound("firstName.equals=" + DEFAULT_FIRST_NAME);

        // Get all the finalUserList where firstName equals to UPDATED_FIRST_NAME
        defaultFinalUserShouldNotBeFound("firstName.equals=" + UPDATED_FIRST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByFirstNameIsInShouldWork() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where firstName in DEFAULT_FIRST_NAME or UPDATED_FIRST_NAME
        defaultFinalUserShouldBeFound("firstName.in=" + DEFAULT_FIRST_NAME + "," + UPDATED_FIRST_NAME);

        // Get all the finalUserList where firstName equals to UPDATED_FIRST_NAME
        defaultFinalUserShouldNotBeFound("firstName.in=" + UPDATED_FIRST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByFirstNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where firstName is not null
        defaultFinalUserShouldBeFound("firstName.specified=true");

        // Get all the finalUserList where firstName is null
        defaultFinalUserShouldNotBeFound("firstName.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalUsersByFirstNameContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where firstName contains DEFAULT_FIRST_NAME
        defaultFinalUserShouldBeFound("firstName.contains=" + DEFAULT_FIRST_NAME);

        // Get all the finalUserList where firstName contains UPDATED_FIRST_NAME
        defaultFinalUserShouldNotBeFound("firstName.contains=" + UPDATED_FIRST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByFirstNameNotContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where firstName does not contain DEFAULT_FIRST_NAME
        defaultFinalUserShouldNotBeFound("firstName.doesNotContain=" + DEFAULT_FIRST_NAME);

        // Get all the finalUserList where firstName does not contain UPDATED_FIRST_NAME
        defaultFinalUserShouldBeFound("firstName.doesNotContain=" + UPDATED_FIRST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByLastNameIsEqualToSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where lastName equals to DEFAULT_LAST_NAME
        defaultFinalUserShouldBeFound("lastName.equals=" + DEFAULT_LAST_NAME);

        // Get all the finalUserList where lastName equals to UPDATED_LAST_NAME
        defaultFinalUserShouldNotBeFound("lastName.equals=" + UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByLastNameIsInShouldWork() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where lastName in DEFAULT_LAST_NAME or UPDATED_LAST_NAME
        defaultFinalUserShouldBeFound("lastName.in=" + DEFAULT_LAST_NAME + "," + UPDATED_LAST_NAME);

        // Get all the finalUserList where lastName equals to UPDATED_LAST_NAME
        defaultFinalUserShouldNotBeFound("lastName.in=" + UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByLastNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where lastName is not null
        defaultFinalUserShouldBeFound("lastName.specified=true");

        // Get all the finalUserList where lastName is null
        defaultFinalUserShouldNotBeFound("lastName.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalUsersByLastNameContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where lastName contains DEFAULT_LAST_NAME
        defaultFinalUserShouldBeFound("lastName.contains=" + DEFAULT_LAST_NAME);

        // Get all the finalUserList where lastName contains UPDATED_LAST_NAME
        defaultFinalUserShouldNotBeFound("lastName.contains=" + UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByLastNameNotContainsSomething() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        // Get all the finalUserList where lastName does not contain DEFAULT_LAST_NAME
        defaultFinalUserShouldNotBeFound("lastName.doesNotContain=" + DEFAULT_LAST_NAME);

        // Get all the finalUserList where lastName does not contain UPDATED_LAST_NAME
        defaultFinalUserShouldBeFound("lastName.doesNotContain=" + UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void getAllFinalUsersByUserIsEqualToSomething() throws Exception {
        // Get already existing entity
        User user = finalUser.getUser();
        finalUserRepository.saveAndFlush(finalUser);
        Long userId = user.getId();

        // Get all the finalUserList where user equals to userId
        defaultFinalUserShouldBeFound("userId.equals=" + userId);

        // Get all the finalUserList where user equals to (userId + 1)
        defaultFinalUserShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultFinalUserShouldBeFound(String filter) throws Exception {
        restFinalUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finalUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].studyYear").value(hasItem(DEFAULT_STUDY_YEAR)))
            .andExpect(jsonPath("$.[*].bio").value(hasItem(DEFAULT_BIO)))
            .andExpect(jsonPath("$.[*].pfp").value(hasItem(DEFAULT_PFP)))
            .andExpect(jsonPath("$.[*].modules").value(hasItem(DEFAULT_MODULES)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)));

        // Check, that the count call also returns 1
        restFinalUserMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultFinalUserShouldNotBeFound(String filter) throws Exception {
        restFinalUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restFinalUserMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingFinalUser() throws Exception {
        // Get the finalUser
        restFinalUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFinalUser() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();

        // Update the finalUser
        FinalUser updatedFinalUser = finalUserRepository.findById(finalUser.getId()).get();
        // Disconnect from session so that the updates on updatedFinalUser are not directly saved in db
        em.detach(updatedFinalUser);
        updatedFinalUser
            .name(UPDATED_NAME)
            .studyYear(UPDATED_STUDY_YEAR)
            .bio(UPDATED_BIO)
            .pfp(UPDATED_PFP)
            .modules(UPDATED_MODULES)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME);
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(updatedFinalUser);

        restFinalUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, finalUserDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finalUserDTO))
            )
            .andExpect(status().isOk());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
        FinalUser testFinalUser = finalUserList.get(finalUserList.size() - 1);
        assertThat(testFinalUser.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinalUser.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
        assertThat(testFinalUser.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testFinalUser.getPfp()).isEqualTo(UPDATED_PFP);
        assertThat(testFinalUser.getModules()).isEqualTo(UPDATED_MODULES);
        assertThat(testFinalUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testFinalUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void putNonExistingFinalUser() throws Exception {
        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();
        finalUser.setId(count.incrementAndGet());

        // Create the FinalUser
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinalUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, finalUserDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFinalUser() throws Exception {
        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();
        finalUser.setId(count.incrementAndGet());

        // Create the FinalUser
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFinalUser() throws Exception {
        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();
        finalUser.setId(count.incrementAndGet());

        // Create the FinalUser
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finalUserDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFinalUserWithPatch() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();

        // Update the finalUser using partial update
        FinalUser partialUpdatedFinalUser = new FinalUser();
        partialUpdatedFinalUser.setId(finalUser.getId());

        partialUpdatedFinalUser.name(UPDATED_NAME).pfp(UPDATED_PFP).lastName(UPDATED_LAST_NAME);

        restFinalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinalUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinalUser))
            )
            .andExpect(status().isOk());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
        FinalUser testFinalUser = finalUserList.get(finalUserList.size() - 1);
        assertThat(testFinalUser.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinalUser.getStudyYear()).isEqualTo(DEFAULT_STUDY_YEAR);
        assertThat(testFinalUser.getBio()).isEqualTo(DEFAULT_BIO);
        assertThat(testFinalUser.getPfp()).isEqualTo(UPDATED_PFP);
        assertThat(testFinalUser.getModules()).isEqualTo(DEFAULT_MODULES);
        assertThat(testFinalUser.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testFinalUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void fullUpdateFinalUserWithPatch() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();

        // Update the finalUser using partial update
        FinalUser partialUpdatedFinalUser = new FinalUser();
        partialUpdatedFinalUser.setId(finalUser.getId());

        partialUpdatedFinalUser
            .name(UPDATED_NAME)
            .studyYear(UPDATED_STUDY_YEAR)
            .bio(UPDATED_BIO)
            .pfp(UPDATED_PFP)
            .modules(UPDATED_MODULES)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME);

        restFinalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinalUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinalUser))
            )
            .andExpect(status().isOk());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
        FinalUser testFinalUser = finalUserList.get(finalUserList.size() - 1);
        assertThat(testFinalUser.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinalUser.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
        assertThat(testFinalUser.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testFinalUser.getPfp()).isEqualTo(UPDATED_PFP);
        assertThat(testFinalUser.getModules()).isEqualTo(UPDATED_MODULES);
        assertThat(testFinalUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testFinalUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingFinalUser() throws Exception {
        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();
        finalUser.setId(count.incrementAndGet());

        // Create the FinalUser
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, finalUserDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(finalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFinalUser() throws Exception {
        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();
        finalUser.setId(count.incrementAndGet());

        // Create the FinalUser
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(finalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFinalUser() throws Exception {
        int databaseSizeBeforeUpdate = finalUserRepository.findAll().size();
        finalUser.setId(count.incrementAndGet());

        // Create the FinalUser
        FinalUserDTO finalUserDTO = finalUserMapper.toDto(finalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(finalUserDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinalUser in the database
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFinalUser() throws Exception {
        // Initialize the database
        finalUserRepository.saveAndFlush(finalUser);

        int databaseSizeBeforeDelete = finalUserRepository.findAll().size();

        // Delete the finalUser
        restFinalUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, finalUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FinalUser> finalUserList = finalUserRepository.findAll();
        assertThat(finalUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
