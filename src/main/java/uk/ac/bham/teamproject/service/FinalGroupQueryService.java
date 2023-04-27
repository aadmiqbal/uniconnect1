package uk.ac.bham.teamproject.service;

import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import uk.ac.bham.teamproject.domain.*; // for static metamodels
import uk.ac.bham.teamproject.domain.FinalGroup;
import uk.ac.bham.teamproject.repository.FinalGroupRepository;
import uk.ac.bham.teamproject.service.criteria.FinalGroupCriteria;
import uk.ac.bham.teamproject.service.dto.FinalGroupDTO;
import uk.ac.bham.teamproject.service.mapper.FinalGroupMapper;

/**
 * Service for executing complex queries for {@link FinalGroup} entities in the database.
 * The main input is a {@link FinalGroupCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link FinalGroupDTO} or a {@link Page} of {@link FinalGroupDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class FinalGroupQueryService extends QueryService<FinalGroup> {

    private final Logger log = LoggerFactory.getLogger(FinalGroupQueryService.class);

    private final FinalGroupRepository finalGroupRepository;

    private final FinalGroupMapper finalGroupMapper;

    public FinalGroupQueryService(FinalGroupRepository finalGroupRepository, FinalGroupMapper finalGroupMapper) {
        this.finalGroupRepository = finalGroupRepository;
        this.finalGroupMapper = finalGroupMapper;
    }

    /**
     * Return a {@link List} of {@link FinalGroupDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<FinalGroupDTO> findByCriteria(FinalGroupCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<FinalGroup> specification = createSpecification(criteria);
        return finalGroupMapper.toDto(finalGroupRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link FinalGroupDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<FinalGroupDTO> findByCriteria(FinalGroupCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<FinalGroup> specification = createSpecification(criteria);
        return finalGroupRepository.findAll(specification, page).map(finalGroupMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(FinalGroupCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<FinalGroup> specification = createSpecification(criteria);
        return finalGroupRepository.count(specification);
    }

    /**
     * Function to convert {@link FinalGroupCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<FinalGroup> createSpecification(FinalGroupCriteria criteria) {
        Specification<FinalGroup> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), FinalGroup_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), FinalGroup_.name));
            }
            if (criteria.getMembers() != null) {
                specification = specification.and(buildStringSpecification(criteria.getMembers(), FinalGroup_.members));
            }
            if (criteria.getIsAdvertised() != null) {
                specification = specification.and(buildSpecification(criteria.getIsAdvertised(), FinalGroup_.isAdvertised));
            }
            if (criteria.getGroupDescription() != null) {
                specification = specification.and(buildStringSpecification(criteria.getGroupDescription(), FinalGroup_.groupDescription));
            }
            if (criteria.getPfp() != null) {
                specification = specification.and(buildStringSpecification(criteria.getPfp(), FinalGroup_.pfp));
            }
            if (criteria.getAdmins() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAdmins(), FinalGroup_.admins));
            }
        }
        return specification;
    }
}
