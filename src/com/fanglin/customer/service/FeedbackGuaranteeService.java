package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.FeedbackGuaranteeVO;

public interface FeedbackGuaranteeService {

	public List<FeedbackGuaranteeVO> queryFeedbackGuarantee(FeedbackGuaranteeVO feedbackGuaranteeVO);

	public FeedbackGuaranteeVO queryFeedbackGuaranteeByFgid(FeedbackGuaranteeVO feedbackGuaranteeVO);

	public int addFeedbackGuarantee(FeedbackGuaranteeVO feedbackGuaranteeVO, String userId) throws FLException;

	public int updateFeedbackGuarantee(FeedbackGuaranteeVO feedbackGuaranteeVO) throws FLException;

}
