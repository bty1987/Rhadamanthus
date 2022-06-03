package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.FeedbackDao;
import com.fanglin.customer.dao.FeedbackDrawingDao;
import com.fanglin.customer.po.FeedbackDrawingPO;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.customer.service.FeedbackService;
import com.fanglin.customer.vo.FeedbackVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("feedbackService")
@Transactional(readOnly = true)
public class FeedbackServiceImpl implements FeedbackService {

	@Autowired
	private FeedbackDao feedbackDao;

	@Autowired
	private FeedbackDrawingDao feedbackDrawingDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageFeedback(Paging paging, List<Filter> filters, int company) {

		List<FeedbackPO> feedbackPOs = feedbackDao.pageFeedback(paging, filters, company);
		List<FeedbackVO> feedbackVOs = new ArrayList<FeedbackVO>();

		for (FeedbackPO feedbackPO : feedbackPOs) {

			FeedbackVO feedbackVO = new FeedbackVO();

			BeanUtil.copyPropertie(feedbackPO, feedbackVO, Arrays.asList("company"));

			feedbackVO.setCompany(feedbackPO.getCompany().getName());

			feedbackVOs.add(feedbackVO);
		}

		paging.setData(feedbackVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFeedback(FeedbackVO feedbackVO) throws FLException {

		FeedbackPO feedbackPO = new FeedbackPO();

		BeanUtil.copyPropertie(feedbackVO, feedbackPO, Arrays.asList("company"));

		feedbackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		feedbackPO.setCompany(companyDao.get(CompanyPO.TYPE_HEADQUARTER_INT));

		if (feedbackVO.getOrderId() != null) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(feedbackVO.getOrderId());

			feedbackPO.setCompany(new CompanyPO(decorationPO.getCompany()));
		}

		feedbackDao.save(feedbackPO);

		if (feedbackVO.getDrawings() != null && feedbackVO.getDrawings().size() != 0) {

			for (String drawing : feedbackVO.getDrawings()) {
				feedbackDrawingDao.save(new FeedbackDrawingPO(feedbackPO.getFid(), drawing));
			}
		}

		return 0;
	}

}
