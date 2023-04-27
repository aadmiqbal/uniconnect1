package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.FinalGroup;
import uk.ac.bham.teamproject.repository.FinalGroupRepository;
import uk.ac.bham.teamproject.service.criteria.FinalGroupCriteria;
import uk.ac.bham.teamproject.service.dto.FinalGroupDTO;
import uk.ac.bham.teamproject.service.mapper.FinalGroupMapper;

/**
 * Integration tests for the {@link FinalGroupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FinalGroupResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MEMBERS = "AAAAAAAAAA";
    private static final String UPDATED_MEMBERS = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_ADVERTISED = false;
    private static final Boolean UPDATED_IS_ADVERTISED = true;

    private static final String DEFAULT_GROUP_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_GROUP_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PFP = "AAAAAAAAAA";
    private static final String UPDATED_PFP = "BBBBBBBBBB";

    private static final String DEFAULT_ADMINS = "AAAAAAAAAA";
    private static final String UPDATED_ADMINS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/final-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FinalGroupRepository finalGroupRepository;

    @Autowired
    private FinalGroupMapper finalGroupMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFinalGroupMockMvc;

    private FinalGroup finalGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinalGroup createEntity(EntityManager em) {
        FinalGroup finalGroup = new FinalGroup()
            .name(DEFAULT_NAME)
            .members(DEFAULT_MEMBERS)
            .isAdvertised(DEFAULT_IS_ADVERTISED)
            .groupDescription(DEFAULT_GROUP_DESCRIPTION)
            .pfp(DEFAULT_PFP)
            .admins(DEFAULT_ADMINS);
        return finalGroup;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinalGroup createUpdatedEntity(EntityManager em) {
        FinalGroup finalGroup = new FinalGroup()
            .name(UPDATED_NAME)
            .members(UPDATED_MEMBERS)
            .isAdvertised(UPDATED_IS_ADVERTISED)
            .groupDescription(UPDATED_GROUP_DESCRIPTION)
            .pfp(UPDATED_PFP)
            .admins(UPDATED_ADMINS);
        return finalGroup;
    }

    @BeforeEach
    public void initTest() {
        finalGroup = createEntity(em);
    }

    @Test
    @Transactional
    void createFinalGroup() throws Exception {
        int databaseSizeBeforeCreate = finalGroupRepository.findAll().size();
        // Create the FinalGroup
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);
        restFinalGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finalGroupDTO)))
            .andExpect(status().isCreated());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeCreate + 1);
        FinalGroup testFinalGroup = finalGroupList.get(finalGroupList.size() - 1);
        assertThat(testFinalGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFinalGroup.getMembers()).isEqualTo(DEFAULT_MEMBERS);
        assertThat(testFinalGroup.getIsAdvertised()).isEqualTo(DEFAULT_IS_ADVERTISED);
        assertThat(testFinalGroup.getGroupDescription()).isEqualTo(DEFAULT_GROUP_DESCRIPTION);
        assertThat(testFinalGroup.getPfp()).isEqualTo(DEFAULT_PFP);
        assertThat(testFinalGroup.getAdmins()).isEqualTo(DEFAULT_ADMINS);
    }

    @Test
    @Transactional
    void createFinalGroupWithExistingId() throws Exception {
        // Create the FinalGroup with an existing ID
        finalGroup.setId(1L);
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);

        int databaseSizeBeforeCreate = finalGroupRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFinalGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finalGroupDTO)))
            .andExpect(status().isBadRequest());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFinalGroups() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList
        restFinalGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finalGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].members").value(hasItem(DEFAULT_MEMBERS)))
            .andExpect(jsonPath("$.[*].isAdvertised").value(hasItem(DEFAULT_IS_ADVERTISED.booleanValue())))
            .andExpect(jsonPath("$.[*].groupDescription").value(hasItem(DEFAULT_GROUP_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].pfp").value(hasItem(DEFAULT_PFP)))
            .andExpect(jsonPath("$.[*].admins").value(hasItem(DEFAULT_ADMINS)));
    }

    @Test
    @Transactional
    void getFinalGroup() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get the finalGroup
        restFinalGroupMockMvc
            .perform(get(ENTITY_API_URL_ID, finalGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(finalGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.members").value(DEFAULT_MEMBERS))
            .andExpect(jsonPath("$.isAdvertised").value(DEFAULT_IS_ADVERTISED.booleanValue()))
            .andExpect(jsonPath("$.groupDescription").value(DEFAULT_GROUP_DESCRIPTION))
            .andExpect(jsonPath("$.pfp").value(DEFAULT_PFP))
            .andExpect(jsonPath("$.admins").value(DEFAULT_ADMINS));
    }

    @Test
    @Transactional
    void getFinalGroupsByIdFiltering() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        Long id = finalGroup.getId();

        defaultFinalGroupShouldBeFound("id.equals=" + id);
        defaultFinalGroupShouldNotBeFound("id.notEquals=" + id);

        defaultFinalGroupShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultFinalGroupShouldNotBeFound("id.greaterThan=" + id);

        defaultFinalGroupShouldBeFound("id.lessThanOrEqual=" + id);
        defaultFinalGroupShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where name equals to DEFAULT_NAME
        defaultFinalGroupShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the finalGroupList where name equals to UPDATED_NAME
        defaultFinalGroupShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByNameIsInShouldWork() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where name in DEFAULT_NAME or UPDATED_NAME
        defaultFinalGroupShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the finalGroupList where name equals to UPDATED_NAME
        defaultFinalGroupShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where name is not null
        defaultFinalGroupShouldBeFound("name.specified=true");

        // Get all the finalGroupList where name is null
        defaultFinalGroupShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalGroupsByNameContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where name contains DEFAULT_NAME
        defaultFinalGroupShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the finalGroupList where name contains UPDATED_NAME
        defaultFinalGroupShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByNameNotContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where name does not contain DEFAULT_NAME
        defaultFinalGroupShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the finalGroupList where name does not contain UPDATED_NAME
        defaultFinalGroupShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByMembersIsEqualToSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where members equals to DEFAULT_MEMBERS
        defaultFinalGroupShouldBeFound("members.equals=" + DEFAULT_MEMBERS);

        // Get all the finalGroupList where members equals to UPDATED_MEMBERS
        defaultFinalGroupShouldNotBeFound("members.equals=" + UPDATED_MEMBERS);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByMembersIsInShouldWork() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where members in DEFAULT_MEMBERS or UPDATED_MEMBERS
        defaultFinalGroupShouldBeFound("members.in=" + DEFAULT_MEMBERS + "," + UPDATED_MEMBERS);

        // Get all the finalGroupList where members equals to UPDATED_MEMBERS
        defaultFinalGroupShouldNotBeFound("members.in=" + UPDATED_MEMBERS);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByMembersIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where members is not null
        defaultFinalGroupShouldBeFound("members.specified=true");

        // Get all the finalGroupList where members is null
        defaultFinalGroupShouldNotBeFound("members.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalGroupsByMembersContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where members contains DEFAULT_MEMBERS
        defaultFinalGroupShouldBeFound("members.contains=" + DEFAULT_MEMBERS);

        // Get all the finalGroupList where members contains UPDATED_MEMBERS
        defaultFinalGroupShouldNotBeFound("members.contains=" + UPDATED_MEMBERS);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByMembersNotContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where members does not contain DEFAULT_MEMBERS
        defaultFinalGroupShouldNotBeFound("members.doesNotContain=" + DEFAULT_MEMBERS);

        // Get all the finalGroupList where members does not contain UPDATED_MEMBERS
        defaultFinalGroupShouldBeFound("members.doesNotContain=" + UPDATED_MEMBERS);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByIsAdvertisedIsEqualToSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where isAdvertised equals to DEFAULT_IS_ADVERTISED
        defaultFinalGroupShouldBeFound("isAdvertised.equals=" + DEFAULT_IS_ADVERTISED);

        // Get all the finalGroupList where isAdvertised equals to UPDATED_IS_ADVERTISED
        defaultFinalGroupShouldNotBeFound("isAdvertised.equals=" + UPDATED_IS_ADVERTISED);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByIsAdvertisedIsInShouldWork() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where isAdvertised in DEFAULT_IS_ADVERTISED or UPDATED_IS_ADVERTISED
        defaultFinalGroupShouldBeFound("isAdvertised.in=" + DEFAULT_IS_ADVERTISED + "," + UPDATED_IS_ADVERTISED);

        // Get all the finalGroupList where isAdvertised equals to UPDATED_IS_ADVERTISED
        defaultFinalGroupShouldNotBeFound("isAdvertised.in=" + UPDATED_IS_ADVERTISED);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByIsAdvertisedIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where isAdvertised is not null
        defaultFinalGroupShouldBeFound("isAdvertised.specified=true");

        // Get all the finalGroupList where isAdvertised is null
        defaultFinalGroupShouldNotBeFound("isAdvertised.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalGroupsByGroupDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where groupDescription equals to DEFAULT_GROUP_DESCRIPTION
        defaultFinalGroupShouldBeFound("groupDescription.equals=" + DEFAULT_GROUP_DESCRIPTION);

        // Get all the finalGroupList where groupDescription equals to UPDATED_GROUP_DESCRIPTION
        defaultFinalGroupShouldNotBeFound("groupDescription.equals=" + UPDATED_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByGroupDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where groupDescription in DEFAULT_GROUP_DESCRIPTION or UPDATED_GROUP_DESCRIPTION
        defaultFinalGroupShouldBeFound("groupDescription.in=" + DEFAULT_GROUP_DESCRIPTION + "," + UPDATED_GROUP_DESCRIPTION);

        // Get all the finalGroupList where groupDescription equals to UPDATED_GROUP_DESCRIPTION
        defaultFinalGroupShouldNotBeFound("groupDescription.in=" + UPDATED_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByGroupDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where groupDescription is not null
        defaultFinalGroupShouldBeFound("groupDescription.specified=true");

        // Get all the finalGroupList where groupDescription is null
        defaultFinalGroupShouldNotBeFound("groupDescription.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalGroupsByGroupDescriptionContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where groupDescription contains DEFAULT_GROUP_DESCRIPTION
        defaultFinalGroupShouldBeFound("groupDescription.contains=" + DEFAULT_GROUP_DESCRIPTION);

        // Get all the finalGroupList where groupDescription contains UPDATED_GROUP_DESCRIPTION
        defaultFinalGroupShouldNotBeFound("groupDescription.contains=" + UPDATED_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByGroupDescriptionNotContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where groupDescription does not contain DEFAULT_GROUP_DESCRIPTION
        defaultFinalGroupShouldNotBeFound("groupDescription.doesNotContain=" + DEFAULT_GROUP_DESCRIPTION);

        // Get all the finalGroupList where groupDescription does not contain UPDATED_GROUP_DESCRIPTION
        defaultFinalGroupShouldBeFound("groupDescription.doesNotContain=" + UPDATED_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByPfpIsEqualToSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where pfp equals to DEFAULT_PFP
        defaultFinalGroupShouldBeFound("pfp.equals=" + DEFAULT_PFP);

        // Get all the finalGroupList where pfp equals to UPDATED_PFP
        defaultFinalGroupShouldNotBeFound("pfp.equals=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByPfpIsInShouldWork() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where pfp in DEFAULT_PFP or UPDATED_PFP
        defaultFinalGroupShouldBeFound("pfp.in=" + DEFAULT_PFP + "," + UPDATED_PFP);

        // Get all the finalGroupList where pfp equals to UPDATED_PFP
        defaultFinalGroupShouldNotBeFound("pfp.in=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByPfpIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where pfp is not null
        defaultFinalGroupShouldBeFound("pfp.specified=true");

        // Get all the finalGroupList where pfp is null
        defaultFinalGroupShouldNotBeFound("pfp.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalGroupsByPfpContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where pfp contains DEFAULT_PFP
        defaultFinalGroupShouldBeFound("pfp.contains=" + DEFAULT_PFP);

        // Get all the finalGroupList where pfp contains UPDATED_PFP
        defaultFinalGroupShouldNotBeFound("pfp.contains=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByPfpNotContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where pfp does not contain DEFAULT_PFP
        defaultFinalGroupShouldNotBeFound("pfp.doesNotContain=" + DEFAULT_PFP);

        // Get all the finalGroupList where pfp does not contain UPDATED_PFP
        defaultFinalGroupShouldBeFound("pfp.doesNotContain=" + UPDATED_PFP);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByAdminsIsEqualToSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where admins equals to DEFAULT_ADMINS
        defaultFinalGroupShouldBeFound("admins.equals=" + DEFAULT_ADMINS);

        // Get all the finalGroupList where admins equals to UPDATED_ADMINS
        defaultFinalGroupShouldNotBeFound("admins.equals=" + UPDATED_ADMINS);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByAdminsIsInShouldWork() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where admins in DEFAULT_ADMINS or UPDATED_ADMINS
        defaultFinalGroupShouldBeFound("admins.in=" + DEFAULT_ADMINS + "," + UPDATED_ADMINS);

        // Get all the finalGroupList where admins equals to UPDATED_ADMINS
        defaultFinalGroupShouldNotBeFound("admins.in=" + UPDATED_ADMINS);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByAdminsIsNullOrNotNull() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where admins is not null
        defaultFinalGroupShouldBeFound("admins.specified=true");

        // Get all the finalGroupList where admins is null
        defaultFinalGroupShouldNotBeFound("admins.specified=false");
    }

    @Test
    @Transactional
    void getAllFinalGroupsByAdminsContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where admins contains DEFAULT_ADMINS
        defaultFinalGroupShouldBeFound("admins.contains=" + DEFAULT_ADMINS);

        // Get all the finalGroupList where admins contains UPDATED_ADMINS
        defaultFinalGroupShouldNotBeFound("admins.contains=" + UPDATED_ADMINS);
    }

    @Test
    @Transactional
    void getAllFinalGroupsByAdminsNotContainsSomething() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        // Get all the finalGroupList where admins does not contain DEFAULT_ADMINS
        defaultFinalGroupShouldNotBeFound("admins.doesNotContain=" + DEFAULT_ADMINS);

        // Get all the finalGroupList where admins does not contain UPDATED_ADMINS
        defaultFinalGroupShouldBeFound("admins.doesNotContain=" + UPDATED_ADMINS);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultFinalGroupShouldBeFound(String filter) throws Exception {
        restFinalGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finalGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].members").value(hasItem(DEFAULT_MEMBERS)))
            .andExpect(jsonPath("$.[*].isAdvertised").value(hasItem(DEFAULT_IS_ADVERTISED.booleanValue())))
            .andExpect(jsonPath("$.[*].groupDescription").value(hasItem(DEFAULT_GROUP_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].pfp").value(hasItem(DEFAULT_PFP)))
            .andExpect(jsonPath("$.[*].admins").value(hasItem(DEFAULT_ADMINS)));

        // Check, that the count call also returns 1
        restFinalGroupMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultFinalGroupShouldNotBeFound(String filter) throws Exception {
        restFinalGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restFinalGroupMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingFinalGroup() throws Exception {
        // Get the finalGroup
        restFinalGroupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFinalGroup() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();

        // Update the finalGroup
        FinalGroup updatedFinalGroup = finalGroupRepository.findById(finalGroup.getId()).get();
        // Disconnect from session so that the updates on updatedFinalGroup are not directly saved in db
        em.detach(updatedFinalGroup);
        updatedFinalGroup
            .name(UPDATED_NAME)
            .members(UPDATED_MEMBERS)
            .isAdvertised(UPDATED_IS_ADVERTISED)
            .groupDescription(UPDATED_GROUP_DESCRIPTION)
            .pfp(UPDATED_PFP)
            .admins(UPDATED_ADMINS);
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(updatedFinalGroup);

        restFinalGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, finalGroupDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finalGroupDTO))
            )
            .andExpect(status().isOk());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
        FinalGroup testFinalGroup = finalGroupList.get(finalGroupList.size() - 1);
        assertThat(testFinalGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinalGroup.getMembers()).isEqualTo(UPDATED_MEMBERS);
        assertThat(testFinalGroup.getIsAdvertised()).isEqualTo(UPDATED_IS_ADVERTISED);
        assertThat(testFinalGroup.getGroupDescription()).isEqualTo(UPDATED_GROUP_DESCRIPTION);
        assertThat(testFinalGroup.getPfp()).isEqualTo(UPDATED_PFP);
        assertThat(testFinalGroup.getAdmins()).isEqualTo(UPDATED_ADMINS);
    }

    @Test
    @Transactional
    void putNonExistingFinalGroup() throws Exception {
        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();
        finalGroup.setId(count.incrementAndGet());

        // Create the FinalGroup
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinalGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, finalGroupDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finalGroupDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFinalGroup() throws Exception {
        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();
        finalGroup.setId(count.incrementAndGet());

        // Create the FinalGroup
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finalGroupDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFinalGroup() throws Exception {
        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();
        finalGroup.setId(count.incrementAndGet());

        // Create the FinalGroup
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalGroupMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finalGroupDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFinalGroupWithPatch() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();

        // Update the finalGroup using partial update
        FinalGroup partialUpdatedFinalGroup = new FinalGroup();
        partialUpdatedFinalGroup.setId(finalGroup.getId());

        partialUpdatedFinalGroup
            .members(UPDATED_MEMBERS)
            .isAdvertised(UPDATED_IS_ADVERTISED)
            .groupDescription(UPDATED_GROUP_DESCRIPTION)
            .admins(UPDATED_ADMINS);

        restFinalGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinalGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinalGroup))
            )
            .andExpect(status().isOk());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
        FinalGroup testFinalGroup = finalGroupList.get(finalGroupList.size() - 1);
        assertThat(testFinalGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFinalGroup.getMembers()).isEqualTo(UPDATED_MEMBERS);
        assertThat(testFinalGroup.getIsAdvertised()).isEqualTo(UPDATED_IS_ADVERTISED);
        assertThat(testFinalGroup.getGroupDescription()).isEqualTo(UPDATED_GROUP_DESCRIPTION);
        assertThat(testFinalGroup.getPfp()).isEqualTo(DEFAULT_PFP);
        assertThat(testFinalGroup.getAdmins()).isEqualTo(UPDATED_ADMINS);
    }

    @Test
    @Transactional
    void fullUpdateFinalGroupWithPatch() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();

        // Update the finalGroup using partial update
        FinalGroup partialUpdatedFinalGroup = new FinalGroup();
        partialUpdatedFinalGroup.setId(finalGroup.getId());

        partialUpdatedFinalGroup
            .name(UPDATED_NAME)
            .members(UPDATED_MEMBERS)
            .isAdvertised(UPDATED_IS_ADVERTISED)
            .groupDescription(UPDATED_GROUP_DESCRIPTION)
            .pfp(UPDATED_PFP)
            .admins(UPDATED_ADMINS);

        restFinalGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinalGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinalGroup))
            )
            .andExpect(status().isOk());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
        FinalGroup testFinalGroup = finalGroupList.get(finalGroupList.size() - 1);
        assertThat(testFinalGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinalGroup.getMembers()).isEqualTo(UPDATED_MEMBERS);
        assertThat(testFinalGroup.getIsAdvertised()).isEqualTo(UPDATED_IS_ADVERTISED);
        assertThat(testFinalGroup.getGroupDescription()).isEqualTo(UPDATED_GROUP_DESCRIPTION);
        assertThat(testFinalGroup.getPfp()).isEqualTo(UPDATED_PFP);
        assertThat(testFinalGroup.getAdmins()).isEqualTo(UPDATED_ADMINS);
    }

    @Test
    @Transactional
    void patchNonExistingFinalGroup() throws Exception {
        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();
        finalGroup.setId(count.incrementAndGet());

        // Create the FinalGroup
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinalGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, finalGroupDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(finalGroupDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFinalGroup() throws Exception {
        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();
        finalGroup.setId(count.incrementAndGet());

        // Create the FinalGroup
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(finalGroupDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFinalGroup() throws Exception {
        int databaseSizeBeforeUpdate = finalGroupRepository.findAll().size();
        finalGroup.setId(count.incrementAndGet());

        // Create the FinalGroup
        FinalGroupDTO finalGroupDTO = finalGroupMapper.toDto(finalGroup);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinalGroupMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(finalGroupDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinalGroup in the database
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFinalGroup() throws Exception {
        // Initialize the database
        finalGroupRepository.saveAndFlush(finalGroup);

        int databaseSizeBeforeDelete = finalGroupRepository.findAll().size();

        // Delete the finalGroup
        restFinalGroupMockMvc
            .perform(delete(ENTITY_API_URL_ID, finalGroup.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FinalGroup> finalGroupList = finalGroupRepository.findAll();
        assertThat(finalGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
