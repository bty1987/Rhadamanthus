package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.SurveyOptionPO;
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.data.po.SurveyTemplateOptionPO;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QeasureDao;
import com.fanglin.quotation.dao.QeasureItemDao;
import com.fanglin.quotation.dao.QeasureOptionDao;
import com.fanglin.quotation.po.QeasureItemPO;
import com.fanglin.quotation.po.QeasureOptionPO;
import com.fanglin.quotation.po.QeasurePO;
import com.fanglin.quotation.service.QeasureService;
import com.fanglin.quotation.vo.QeasureItemVO;
import com.fanglin.quotation.vo.QeasureOptionVO;
import com.fanglin.quotation.vo.QeasureVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("qeasureService")
@Transactional(readOnly = true)
public class QeasureServiceImpl implements QeasureService {

	@Autowired
	private QeasureDao qeasureDao;

	@Autowired
	private QeasureItemDao qeasureItemDao;

	@Autowired
	private QeasureOptionDao qeasureOptionDao;

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageQeasure(Paging paging, List<Filter> filters, int company) {

		List<QeasurePO> qeasurePOs = qeasureDao.pageQeasure(paging, filters, company);
		List<QeasureVO> qeasureVOs = new ArrayList<QeasureVO>();

		for (QeasurePO qeasurePO : qeasurePOs) {
			qeasureVOs.add(qeasurePO.ptv(new QeasureVO(new UserBaseVO())));
		}

		paging.setData(qeasureVOs);

	}

	@Override
	public QeasureVO queryQeasureByOrderId(QeasureVO qeasureVO) throws FLException {

		QeasurePO qeasurePO = qeasureDao.queryQeasureByOrderId(qeasureVO.getOrderId());

		if (qeasurePO == null) return qeasureVO;

		List<QeasureItemPO> qeasureItemPOs = qeasureItemDao.queryQeasureItem(qeasurePO.getQmid());

		return qeasurePO.ptv(new QeasureVO(new ArrayList<QeasureItemVO>(), new UserBaseVO()), qeasureItemPOs);
	}

	@Override
	public QeasureVO queryQeasureByQmid(QeasureVO qeasureVO) throws FLException {

		QeasurePO qeasurePO = qeasureDao.get(qeasureVO.getQmid());

		if (qeasurePO == null) return qeasureVO;

		List<QeasureItemPO> qeasureItemPOs = qeasureItemDao.queryQeasureItem(qeasurePO.getQmid());

		return qeasurePO.ptv(new QeasureVO(new ArrayList<QeasureItemVO>(), new UserBaseVO()), qeasureItemPOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeQeasure(QeasureVO qeasureVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(qeasureVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		QeasurePO qeasurePO = new QeasurePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		String orderId = qeasureVO.getOrderId();

		BeanUtil.copyProperties(qeasureVO, qeasurePO, Arrays.asList("creater"));

		qeasurePO.setName(surveyTemplatePO.getName());
		qeasurePO.setCreater(creater);
		qeasurePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		qeasurePO.setOrderId(orderId);
		qeasurePO.setTid(surveyTemplatePO.getStid());
		qeasurePO.setCompany(company);

		qeasureDao.save(qeasurePO);

		List<SurveyTemplateItemPO> surveyTemplateItemPOs = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO surveyTemplateItemPO : surveyTemplateItemPOs) {

			QeasureItemPO qeasureItemPO = new QeasureItemPO();

			qeasureItemPO.setName(surveyTemplateItemPO.getName());
			qeasureItemPO.setContent(surveyTemplateItemPO.getContent());
			qeasureItemPO.setType(surveyTemplateItemPO.getType());
			qeasureItemPO.setRequire(surveyTemplateItemPO.getRequire());

			qeasureItemPO.setAtttype(QeasureItemPO.ATTTYPE_QEASURE_INT);

			qeasureItemPO.setQmid(qeasurePO.getQmid());

			qeasureItemDao.save(qeasureItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT, QeasureItemPO.TYPE_DATE_INT).contains(surveyTemplateItemPO.getType())) continue;

			List<SurveyTemplateOptionPO> surveyTemplateOptionPOs = surveyTemplateItemPO.getOptions();

			if (surveyTemplateOptionPOs == null) continue;

			for (SurveyTemplateOptionPO surveyTemplateOptionPO : surveyTemplateOptionPOs) {

				QeasureOptionPO qeasureOptionPO = new QeasureOptionPO();

				qeasureOptionPO.setTitle(surveyTemplateOptionPO.getTitle());

				qeasureOptionPO.setQmid(qeasurePO.getQmid());
				qeasureOptionPO.setQmiid(qeasureItemPO.getQmiid());
				qeasureOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

				qeasureOptionDao.save(qeasureOptionPO);
			}
		}

		qeasureVO.setQmid(qeasurePO.getQmid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleQeasure(QeasureVO qeasureVO) throws FLException {

		if (qeasureVO.getItems() == null) {
			throw new FLException(200083, "量房单不存在");
		}

		List<QeasureItemVO> qeasureItems = qeasureVO.getItems();

		for (QeasureItemVO itemVO : qeasureItems) {

			QeasureItemPO itemPO = qeasureItemDao.get(itemVO.getQmiid());

			if (Arrays.asList(QeasureItemPO.TYPE_TEXT_INT, QeasureItemPO.TYPE_INPUT_INT, QeasureItemPO.TYPE_DATE_INT).contains(itemPO.getType())) {
				qeasureItemDao.update(itemPO.setContent(itemVO.getContent()));
			}

			List<QeasureOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (QeasureOptionVO optionVO : options) {

				if (optionVO == null) continue;

				QeasureOptionPO optionPO = qeasureOptionDao.get(optionVO.getQmoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				qeasureOptionDao.update(optionPO);
			}
		}
	}

}
