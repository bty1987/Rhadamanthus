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
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.data.po.SurveyTemplateOptionPO;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationProfileDao;
import com.fanglin.quotation.dao.QuotationProfileItemDao;
import com.fanglin.quotation.dao.QuotationProfileOptionDao;
import com.fanglin.quotation.po.QuotationProfileItemPO;
import com.fanglin.quotation.po.QuotationProfileOptionPO;
import com.fanglin.quotation.po.QuotationProfilePO;
import com.fanglin.quotation.service.QuotationProfileService;
import com.fanglin.quotation.vo.QuotationProfileItemVO;
import com.fanglin.quotation.vo.QuotationProfileOptionVO;
import com.fanglin.quotation.vo.QuotationProfileVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationProfileService")
@Transactional(readOnly = true)
public class QuotationProfileServiceImpl implements QuotationProfileService {

	@Autowired
	private QuotationProfileDao quotationProfileDao;

	@Autowired
	private QuotationProfileItemDao quotationProfileItemDao;

	@Autowired
	private QuotationProfileOptionDao quotationProfileOptionDao;

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageQuotationProfile(Paging paging, List<Filter> filters, int company) {

		List<QuotationProfilePO> quotationProfilePOs = quotationProfileDao.pageQuotationProfile(paging, filters, company);
		List<QuotationProfileVO> quotationProfileVOs = new ArrayList<QuotationProfileVO>();

		for (QuotationProfilePO quotationProfilePO : quotationProfilePOs) {
			quotationProfileVOs.add(quotationProfilePO.ptv(new QuotationProfileVO(new UserBaseVO())));
		}

		paging.setData(quotationProfileVOs);
	}

	@Override
	public List<QuotationProfileVO> queryQuotationProfileByQid(QuotationProfileVO quotationProfileVO) throws FLException {

		List<QuotationProfilePO> quotationProfilePOs = quotationProfileDao.queryQuotationProfileByQid(quotationProfileVO.getQid(), quotationProfileVO.getType());
		List<QuotationProfileVO> quotationProfileVOs = new ArrayList<QuotationProfileVO>();

		for (QuotationProfilePO quotationProfilePO : quotationProfilePOs) {
			quotationProfileVOs.add(quotationProfilePO.ptv(new QuotationProfileVO(new ArrayList<QuotationProfileItemVO>(), new UserBaseVO())));
		}

		return quotationProfileVOs;
	}

	@Override
	public List<QuotationProfileVO> queryQuotationProfileByOrderId(QuotationProfileVO quotationProfileVO) throws FLException {

		List<QuotationProfilePO> quotationProfilePOs = quotationProfileDao.queryQuotationProfileByOrderId(quotationProfileVO.getOrderId(), quotationProfileVO.getType());
		List<QuotationProfileVO> quotationProfileVOs = new ArrayList<QuotationProfileVO>();

		for (QuotationProfilePO quotationProfilePO : quotationProfilePOs) {
			quotationProfileVOs.add(quotationProfilePO.ptv(new QuotationProfileVO(new ArrayList<QuotationProfileItemVO>(), new UserBaseVO())));
		}

		return quotationProfileVOs;
	}

	@Override
	public QuotationProfileVO queryQuotationProfileByQpid(QuotationProfileVO quotationProfileVO) throws FLException {

		QuotationProfilePO quotationProfilePO = quotationProfileDao.get(quotationProfileVO.getQpid());

		if (quotationProfilePO == null) {
			throw new FLException(330087, "报价配置不存在");
		}

		quotationProfileVO = quotationProfilePO.ptv(new QuotationProfileVO(new ArrayList<QuotationProfileItemVO>(), new UserBaseVO()));

		return quotationProfileVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationProfile(QuotationProfileVO quotationProfileVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(quotationProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		if (quotationProfileVO.getItems() == null) {
			throw new FLException(330087, "报价配置不存在");
		}

		QuotationProfilePO quotationProfilePO = new QuotationProfilePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		String orderId = quotationProfileVO.getOrderId();

		BeanUtil.copyProperties(quotationProfileVO, quotationProfilePO, Arrays.asList("creater"));

		quotationProfilePO.setName(surveyTemplatePO.getName());
		quotationProfilePO.setCreater(creater);
		quotationProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationProfilePO.setOrderId(orderId);
		quotationProfilePO.setTid(surveyTemplatePO.getStid());
		if (quotationProfileVO.getType() != null) {
			quotationProfilePO.setType(quotationProfileVO.getType());
		}
		quotationProfilePO.setCompany(company);
		quotationProfilePO.setStatus(QuotationProfilePO.STATUS_INIT_INT);

		quotationProfileDao.save(quotationProfilePO);

		List<QuotationProfileItemVO> quotationProfileItems = quotationProfileVO.getItems();

		for (QuotationProfileItemVO itemVO : quotationProfileItems) {

			QuotationProfileItemPO quotationProfileItemPO = new QuotationProfileItemPO();

			quotationProfileItemPO.setName(itemVO.getName());
			quotationProfileItemPO.setContent(itemVO.getContent());
			quotationProfileItemPO.setType(itemVO.getType());
			quotationProfileItemPO.setRequire(itemVO.getRequire());

			quotationProfileItemPO.setQpid(quotationProfilePO.getQpid());

			quotationProfileItemDao.save(quotationProfileItemPO);

			if (Arrays.asList(QuotationProfileItemPO.TYPE_TEXT_INT, QuotationProfileItemPO.TYPE_INPUT_INT, QuotationProfileItemPO.TYPE_DATE_INT).contains(itemVO.getType())) continue;

			List<QuotationProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (QuotationProfileOptionVO optionVO : options) {

				QuotationProfileOptionPO quotationProfileOptionPO = new QuotationProfileOptionPO();

				quotationProfileOptionPO.setQpid(quotationProfilePO.getQpid());
				quotationProfileOptionPO.setQpiid(quotationProfileItemPO.getQpiid());
				quotationProfileOptionPO.setTitle(optionVO.getTitle());
				quotationProfileOptionPO.setChecked(optionVO.getChecked());

				quotationProfileOptionDao.save(quotationProfileOptionPO);
			}
		}

		quotationProfileVO.setQpid(quotationProfilePO.getQpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeQuotationProfile(QuotationProfileVO quotationProfileVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(quotationProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		QuotationProfilePO quotationProfilePO = new QuotationProfilePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		String orderId = quotationProfileVO.getOrderId();

		BeanUtil.copyProperties(quotationProfileVO, quotationProfilePO, Arrays.asList("creater"));

		quotationProfilePO.setName(surveyTemplatePO.getName());
		quotationProfilePO.setCreater(creater);
		quotationProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationProfilePO.setOrderId(orderId);
		quotationProfilePO.setTid(surveyTemplatePO.getStid());
		if (quotationProfileVO.getType() != null) {
			quotationProfilePO.setType(quotationProfileVO.getType());
		}
		quotationProfilePO.setCompany(company);

		quotationProfileDao.save(quotationProfilePO);

		if (surveyTemplatePO.getIsSend() == SurveyTemplatePO.ISSEND_AUTOMATIC_INT) {
			quotationProfilePO.setStatus(QuotationProfilePO.STATUS_SEND_INT);
		} else {
			quotationProfilePO.setStatus(QuotationProfilePO.STATUS_INIT_INT);
		}

		quotationProfileDao.update(quotationProfilePO);

		List<SurveyTemplateItemPO> surveyTemplateItemPOs = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO surveyTemplateItemPO : surveyTemplateItemPOs) {

			QuotationProfileItemPO quotationProfileItemPO = new QuotationProfileItemPO();

			quotationProfileItemPO.setName(surveyTemplateItemPO.getName());
			quotationProfileItemPO.setContent(surveyTemplateItemPO.getContent());
			quotationProfileItemPO.setType(surveyTemplateItemPO.getType());
			quotationProfileItemPO.setRequire(surveyTemplateItemPO.getRequire());

			quotationProfileItemPO.setQpid(quotationProfilePO.getQpid());

			quotationProfileItemDao.save(quotationProfileItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT, SurveyTemplateItemPO.TYPE_DATE_INT).contains(surveyTemplateItemPO.getType())) continue;

			List<SurveyTemplateOptionPO> surveyTemplateOptionPOs = surveyTemplateItemPO.getOptions();

			if (surveyTemplateOptionPOs == null) continue;

			for (SurveyTemplateOptionPO surveyTemplateOptionPO : surveyTemplateOptionPOs) {

				QuotationProfileOptionPO quotationProfileOptionPO = new QuotationProfileOptionPO();

				quotationProfileOptionPO.setTitle(surveyTemplateOptionPO.getTitle());

				quotationProfileOptionPO.setQpid(quotationProfilePO.getQpid());
				quotationProfileOptionPO.setQpiid(quotationProfileItemPO.getQpiid());
				quotationProfileOptionPO.setChecked(QuotationProfileOptionPO.CHECKED_INIT_INT);

				quotationProfileOptionDao.save(quotationProfileOptionPO);
			}
		}

		quotationProfileVO.setQpid(quotationProfilePO.getQpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleQuotationProfile(QuotationProfileVO quotationProfileVO) throws FLException {
		if (quotationProfileVO == null || quotationProfileVO.getItems() == null) {
			throw new FLException(330087, "报价配置不存在");
		}

		List<QuotationProfileItemVO> quotationProfileItems = quotationProfileVO.getItems();

		for (QuotationProfileItemVO itemVO : quotationProfileItems) {

			QuotationProfileItemPO itemPO = quotationProfileItemDao.get(itemVO.getQpiid());
			if (itemPO == null) continue;

			if (Arrays.asList(QuotationProfileItemPO.TYPE_TEXT_INT, QuotationProfileItemPO.TYPE_INPUT_INT, QuotationProfileItemPO.TYPE_DATE_INT).contains(itemPO.getType())) {
				itemPO.setContent(itemVO.getContent());
				quotationProfileItemDao.update(itemPO);
			}

			List<QuotationProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;
			for (QuotationProfileOptionVO optionVO : options) {

				if (optionVO == null) continue;

				QuotationProfileOptionPO optionPO = quotationProfileOptionDao.get(optionVO.getQpoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				quotationProfileOptionDao.update(optionPO);
			}
		}
	}

}
