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
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.repository.FinalUserRepository;
import uk.ac.bham.teamproject.service.criteria.FinalUserCriteria;
import uk.ac.bham.teamproject.service.dto.FinalUserDTO;
import uk.ac.bham.teamproject.service.mapper.FinalUserMapper;

/**
 * Service for executing complex queries for {@link FinalUser} entities in the database.
 * The main input is a {@link FinalUserCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link FinalUserDTO} or a {@link Page} of {@link FinalUserDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class FinalUserQueryService extends QueryService<FinalUser> {

    private final Logger log = LoggerFactory.getLogger(FinalUserQueryService.class);

    private final FinalUserRepository finalUserRepository;

    private final FinalUserMapper finalUserMapper;

    public FinalUserQueryService(FinalUserRepository finalUserRepository, FinalUserMapper finalUserMapper) {
        this.finalUserRepository = finalUserRepository;
        this.finalUserMapper = finalUserMapper;
    }

    /**
     * Return a {@link List} of {@link FinalUserDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<FinalUserDTO> findByCriteria(FinalUserCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<FinalUser> specification = createSpecification(criteria);
        return finalUserMapper.toDto(finalUserRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link FinalUserDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<FinalUserDTO> findByCriteria(FinalUserCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<FinalUser> specification = createSpecification(criteria);
        return finalUserRepository.findAll(specification, page).map(finalUserMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(FinalUserCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<FinalUser> specification = createSpecification(criteria);
        return finalUserRepository.count(specification);
    }

    /**
     * Function to convert {@link FinalUserCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<FinalUser> createSpecification(FinalUserCriteria criteria) {
        Specification<FinalUser> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), FinalUser_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), FinalUser_.name));
            }
            if (criteria.getStudyYear() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getStudyYear(), FinalUser_.studyYear));
            }
            if (criteria.getBio() != null) {
                specification = specification.and(buildStringSpecification(criteria.getBio(), FinalUser_.bio));
            }
            if (criteria.getPfp() != null) {
                specification = specification.and(buildStringSpecification(criteria.getPfp(), FinalUser_.pfp));
            }
            if (criteria.getModules() != null) {
                specification = specification.and(buildStringSpecification(criteria.getModules(), FinalUser_.modules));
            }
            if (criteria.getFirstName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getFirstName(), FinalUser_.firstName));
            }
            if (criteria.getLastName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastName(), FinalUser_.lastName));
            }
            if (criteria.getUserId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getUserId(), root -> root.join(FinalUser_.user, JoinType.LEFT).get(User_.id))
                    );
            }
        }
        return specification;
    }
}
