package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.FeedbackBackVisitVO;

public interface FeedbackBackVisitService {

	public List<FeedbackBackVisitVO> queryFeedbackBackVisit(FeedbackBackVisitVO feedbackBackVisitVO);

	public long addFeedbackBackVisit(FeedbackBackVisitVO feedbackBackVisitVO, String userId) throws FLException;

}
