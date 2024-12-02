package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.vo.FeedbackRecordVO;

public interface FeedbackRecordService {

	public List<FeedbackRecordVO> queryFeedbackRecord(FeedbackRecordVO feedbackRecord);

	public int addFeedbackRecord(FeedbackRecordVO feedbackRecord, Authentication authentication) throws FLException;

}
