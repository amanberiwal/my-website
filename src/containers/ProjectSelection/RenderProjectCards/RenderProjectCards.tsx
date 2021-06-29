import React, { FC, Fragment, useCallback, useState } from 'react';
import { emptyProject } from '../../../assets';
import Styles from './RenderProjectCards.module.scss';
import { Loader, LoaderSize } from '../../../components';
import { RootState } from '../../../redux';
import { connect } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { Project } from '../../../repos';
import { ProjectCard } from '../ProjectCard2';

interface RenderProjectCardsProps {
	projects?: Project[] | undefined;
	query: string;
}

const RenderProjectCards: FC<RenderProjectCardsProps> = (props) => {
	const { projects, query } = props;

	const [isSeeAll, setIsSeeAll] = useState<boolean>();

	const seeAllHandler = () => {
		setIsSeeAll(true);
	};

	const invokeSeeAllHandler = () => {
		setIsSeeAll(false);
	};

	const renderProjectCards = useCallback(() => {
		if (!projects) {
			return (
				<Grid
					container
					item
					justify="center"
					alignItems="center"
					className={Styles.loaderContainer}
				>
					<Loader size={LoaderSize.lg} />
					<Typography variant="h5" color="primary">
						Loading Your Projects
					</Typography>
				</Grid>
			);
		}

		const filteredProjects = projects
			.filter((project) => {
				return project.name.toLowerCase().includes(query.toLowerCase());
			})
			.map((project) => {
				return project;
			});

		if (filteredProjects.length === 0) {
			return (
				<Grid container item justify="center" className={Styles.imgContainer}>
					<Grid item>
						<img src={emptyProject} alt="empty-project"></img>
					</Grid>
				</Grid>
			);
		}

		return (
			<Grid
				container
				item
				direction="column"
				className={Styles.cardContainer}
				spacing={3}
			>
				<Grid container item spacing={3} xs={12} justify="center">
					<Grid item xs={12}>
						<Typography variant="subtitle1">Ongoing</Typography>
					</Grid>
					{filteredProjects
						.filter((project) => !project.isCompleted)
						.slice(0, isSeeAll ? filteredProjects.length : 4) // Need to be reviwed for better performance or alternative
						.map((project, index) => {
							return (
								<Grid xs={6} md={4} lg={3} item key={project.projectId}>
									<ProjectCard
										color={project.color}
										name={project.name}
										startDate={project.startDate}
										projectId={project.projectId}
										projectContact={project.projectContact}
										location={project.location}
										manager={project.manager}
										team={project.team}
										isCompleted={project.isCompleted}
										email={project.email}
										password={project.password}
										createdAt={project.createdAt}
									/>
								</Grid>
							);
						})}
				</Grid>
				<Grid item style={{ marginLeft: 'auto' }} onClick={seeAllHandler}>
					{!isSeeAll && (
						<Typography variant="subtitle1" className={Styles.seeAll}>
							See All
						</Typography>
					)}
				</Grid>

				{isSeeAll && (
					<Fragment>
						<Grid item>
							<Typography variant="h6">Completed</Typography>
						</Grid>
						<Grid container item spacing={5}>
							{filteredProjects
								.filter((project) => project.isCompleted)
								.map((project, index) => {
									return (
										<Grid item key={project.projectId}>
											<ProjectCard
												color={project.color}
												name={project.name}
												startDate={project.startDate}
												projectId={project.projectId}
												projectContact={project.projectContact}
												location={project.location}
												manager={project.manager}
												team={project.team}
												isCompleted={project.isCompleted}
												email={project.email}
												password={project.password}
												createdAt={project.createdAt}
											/>
										</Grid>
									);
								})}
						</Grid>
						<Grid
							item
							style={{ marginLeft: 'auto' }}
							onClick={invokeSeeAllHandler}
						>
							{isSeeAll && (
								<Typography variant="h6" className={Styles.seeAll}>
									Collapse All
								</Typography>
							)}
						</Grid>
					</Fragment>
				)}
			</Grid>
		);
	}, [projects, query, isSeeAll]);

	return renderProjectCards();
};

const mapStateToProps = (state: RootState) => {
	const { projects } = state.Project;
	return { projects };
};

export default connect(mapStateToProps)(RenderProjectCards);
