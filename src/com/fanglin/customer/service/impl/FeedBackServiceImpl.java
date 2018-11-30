package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.FeedBackDao;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.customer.service.FeedBackService;
import com.fanglin.customer.vo.FeedBackVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("feedBackService")
@Transactional(readOnly=true)
public class FeedBackServiceImpl implements FeedBackService{
	
	@Autowired
	private FeedBackDao feedBackDao;
	
	@Override
	public void pageFeedback(Paging paging, List<Filter> filters) {
		
		List<FeedbackPO> feedbackPOs = feedBackDao.pageFeedback(paging, filters);
		
		List<FeedBackVO> feedBackVOs = new ArrayList<FeedBackVO>();
		
		if(feedbackPOs.size() != 0 && feedbackPOs != null){
			
			for (FeedbackPO feedbackPO : feedbackPOs) {
				
				FeedBackVO feedBackVO = new FeedBackVO();
				
				BeanUtil.copyPropertie(feedbackPO, feedBackVO); 	
				
				feedBackVOs.add(feedBackVO);
				
			}
			
		}
		
		paging.setData(feedBackVOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addFeedBack(FeedBackVO feedBackVO) throws FLException {
		
		FeedbackPO feedbackPO = new FeedbackPO();
		
		BeanUtil.copyPropertie(feedBackVO, feedbackPO);

		feedbackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		feedBackDao.save(feedbackPO);
		
		return 0;
	}

}
