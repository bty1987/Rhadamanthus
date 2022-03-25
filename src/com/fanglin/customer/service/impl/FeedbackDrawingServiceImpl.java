package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.FeedbackDrawingDao;
import com.fanglin.customer.po.FeedbackDrawingPO;
import com.fanglin.customer.service.FeedbackDrawingService;
import com.fanglin.customer.vo.FeedbackDrawingVO;
import com.fanglin.customer.vo.FeedbackVO;
import com.fanglin.utils.BeanUtil;

@Service("feedbackDrawingService")
@Transactional(readOnly = true)
public class FeedbackDrawingServiceImpl implements FeedbackDrawingService {

	@Autowired
	private FeedbackDrawingDao feedbackDrawingDao;

	@Override
	public List<FeedbackDrawingVO> queryFeedbackDrawing(FeedbackVO feedback) {

		List<FeedbackDrawingPO> feedbackDrawingPOs = feedbackDrawingDao.queryFeedbackDrawing(feedback.getFid());
		List<FeedbackDrawingVO> feedbackDrawingVOs = new ArrayList<FeedbackDrawingVO>();

		FeedbackDrawingVO feedbackDrawing;

		for (FeedbackDrawingPO feedbackDrawingPO : feedbackDrawingPOs) {

			feedbackDrawing = new FeedbackDrawingVO();

			BeanUtil.copyProperties(feedbackDrawingPO, feedbackDrawing);

			feedbackDrawingVOs.add(feedbackDrawing);
		}

		return feedbackDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addFeedbackDrawing(FeedbackDrawingVO feedbackDrawing) {

		FeedbackDrawingPO feedbackDrawingPO = new FeedbackDrawingPO();

		BeanUtil.copyProperties(feedbackDrawing, feedbackDrawingPO);

		feedbackDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		feedbackDrawingDao.save(feedbackDrawingPO);
	}

}
