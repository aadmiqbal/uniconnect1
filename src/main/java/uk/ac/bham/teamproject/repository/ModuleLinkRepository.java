package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.ModuleLink;

/**
 * Spring Data JPA repository for the ModuleLink entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ModuleLinkRepository extends JpaRepository<ModuleLink, Long> {}
