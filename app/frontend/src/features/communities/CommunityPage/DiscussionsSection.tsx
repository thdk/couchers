import { Dialog, DialogContent } from "@material-ui/core";
import Alert from "components/Alert";
import Button from "components/Button";
import CircularProgress from "components/CircularProgress";
import NewComment from "components/Comments/NewComment";
import IconButton from "components/IconButton";
import { AddIcon, EmailIcon } from "components/Icons";
import TextBody from "components/TextBody";
import {
  DISCUSSIONS_EMPTY_STATE,
  DISCUSSIONS_TITLE,
  NEW_POST_LABEL,
  SEE_MORE_DISCUSSIONS_LABEL,
} from "features/communities/constants";
import {
  useListDiscussions,
  useNewDiscussionMutation,
} from "features/communities/hooks";
import { Community } from "pb/communities_pb";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { routeToCommunity } from "routes";
import hasAtLeastOnePage from "utils/hasAtLeastOnePage";
import makeStyles from "utils/makeStyles";

import { useCommunityPageStyles } from "./CommunityPage";
import DiscussionCard from "./DiscussionCard";
import SectionTitle from "./SectionTitle";

const useStyles = makeStyles((theme) => ({
  discussionsContainer: {
    "& > *": {
      width: "100%",
    },
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  discussionsHeader: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },
  newPostButton: {
    margin: theme.spacing(1),
  },
}));

export default function DiscussionsSection({
  community,
}: {
  community: Community.AsObject;
}) {
  const classes = { ...useCommunityPageStyles(), ...useStyles() };

  //temporary
  const [isNewCommentOpen, setIsNewCommentOpen] = useState(false);

  const {
    isLoading: isDiscussionsLoading,
    error: discussionsError,
    data: discussions,
    hasNextPage: discussionsHasNextPage,
  } = useListDiscussions(community.communityId);

  const queryClient = useQueryClient();
  const newDiscussionMutation = useNewDiscussionMutation(queryClient);
  const history = useHistory();

  return (
    <>
      <div className={classes.discussionsHeader}>
        <SectionTitle icon={<EmailIcon />}>{DISCUSSIONS_TITLE}</SectionTitle>
        <IconButton
          aria-label={NEW_POST_LABEL}
          onClick={() => setIsNewCommentOpen(true)}
        >
          <AddIcon />
        </IconButton>
      </div>
      {discussionsError && (
        <Alert severity="error">{discussionsError.message}</Alert>
      )}
      {
        //This comment adding dialog is temporary
      }
      <Dialog
        open={isNewCommentOpen}
        onClose={() => setIsNewCommentOpen(false)}
      >
        <DialogContent>
          {newDiscussionMutation.error && (
            <Alert severity="error">
              {newDiscussionMutation.error.message}
            </Alert>
          )}
          <NewComment
            onComment={async (content) => {
              newDiscussionMutation.mutate({
                content,
                ownerCommunityId: community.communityId,
                title: "test",
              });
            }}
          />
        </DialogContent>
      </Dialog>
      <div className={classes.discussionsContainer}>
        {isDiscussionsLoading && <CircularProgress />}
        {hasAtLeastOnePage(discussions, "discussionsList") ? (
          discussions.pages
            .flatMap((res) => res.discussionsList)
            .map((discussion) => (
              <DiscussionCard
                discussion={discussion}
                key={`discussioncard-${discussion.threadId}`}
              />
            ))
        ) : (
          <TextBody>{DISCUSSIONS_EMPTY_STATE}</TextBody>
        )}
        {discussionsHasNextPage && (
          <div className={classes.loadMoreButton}>
            <Button
              onClick={() =>
                history.push(
                  routeToCommunity(
                    community.communityId,
                    community.slug,
                    "discussions"
                  )
                )
              }
            >
              {SEE_MORE_DISCUSSIONS_LABEL}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
