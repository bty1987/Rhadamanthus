package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.FeedbackDrawingVO;
import com.fanglin.customer.vo.FeedbackVO;

public interface FeedbackDrawingService {

	public List<FeedbackDrawingVO> queryFeedbackDrawing(FeedbackVO feedbackVO);

	public void addFeedbackDrawing(FeedbackDrawingVO feedbackDrawingVO);

}
