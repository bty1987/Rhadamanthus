package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.FeedbackDrawingVO;
import com.fanglin.customer.vo.FeedbackVO;

public interface FeedbackDrawingService {

	public List<FeedbackDrawingVO> queryFeedbackDrawing(FeedbackVO feedbackVO);

	public List<FeedbackDrawingVO> queryFeedbackDrawingBySid(FeedbackDrawingVO feedbackDrawingVO);

	public long addFeedbackDrawing(FeedbackDrawingVO feedbackDrawingVO);
	
	public void deleteFeedbackDrawing(FeedbackDrawingVO feedbackDrawingVO);
	
	public void updateFeedbackDrawingByFdids(FeedbackDrawingVO feedbackDrawingVO);
	
}
