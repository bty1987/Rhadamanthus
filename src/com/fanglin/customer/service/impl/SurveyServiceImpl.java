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
import com.fanglin.customer.dao.SurveyDao;
import com.fanglin.customer.dao.SurveyItemDao;
import com.fanglin.customer.dao.SurveyOptionDao;
import com.fanglin.customer.po.SurveyItemPO;
import com.fanglin.customer.po.SurveyOptionPO;
import com.fanglin.customer.po.SurveyPO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.service.SurveyService;
import com.fanglin.customer.vo.SurveyItemVO;
import com.fanglin.customer.vo.SurveyOptionVO;
import com.fanglin.customer.vo.SurveyVO;
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.data.po.SurveyTemplateOptionPO;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("surveyService")
@Transactional(readOnly = true)
public class SurveyServiceImpl implements SurveyService {

	@Autowired
	private SurveyDao surveyDao;

	@Autowired
	private SurveyItemDao surveyItemDao;

	@Autowired
	private SurveyOptionDao surveyOptionDao;

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private UserDao userdDao;

	@Override
	public void pageSurvey(Paging paging, List<Filter> filters, int company) {

		List<SurveyPO> surveyPOs = surveyDao.pageSurvey(paging, filters, company);
		List<SurveyVO> surveyVOs = new ArrayList<SurveyVO>();

		for (SurveyPO surveyPO : surveyPOs) {

			SurveyVO surveyVO = new SurveyVO(new ArrayList<SurveyItemVO>(), new UserVO());

			BeanUtil.copyProperties(surveyPO, surveyVO, Arrays.asList("items", "creater"));
			BeanUtil.copyProperties(surveyPO.getCreater(), surveyVO.getCreater(), Arrays.asList("dept", "role", "duty"));
			surveyVOs.add(surveyVO);
		}

		paging.setData(surveyVOs);
	}

	@Override
	public List<SurveyVO> querySurveyByOrderId(SurveyVO surveyVO) {

		List<SurveyPO> surveyPOs = surveyDao.querySurveyByOrderId(surveyVO.getOrderId());
		List<SurveyVO> surveyVOs = new ArrayList<SurveyVO>();

		for (SurveyPO surveyPO : surveyPOs) {

			surveyVO = new SurveyVO(new ArrayList<SurveyItemVO>(), new UserVO());

			BeanUtil.copyProperties(surveyPO, surveyVO, Arrays.asList("items", "creater"));
			BeanUtil.copyProperties(surveyPO.getCreater(), surveyVO.getCreater(), Arrays.asList("dept", "role", "duty"));

			surveyVOs.add(surveyVO);
		}

		return surveyVOs;
	}

	@Override
	public SurveyVO querySurveyBySid(SurveyVO surveyVO) {

		SurveyPO surveyPO = surveyDao.get(surveyVO.getSid());

		surveyVO = new SurveyVO(new ArrayList<SurveyItemVO>(), new UserVO());

		BeanUtil.copyProperties(surveyPO, surveyVO, Arrays.asList("items", "creater"));
		BeanUtil.copyProperties(surveyPO.getCreater(), surveyVO.getCreater(), Arrays.asList("dept", "role", "duty"));

		for (SurveyItemPO itemPO : surveyPO.getItems()) {

			SurveyItemVO itemVO = new SurveyItemVO(new ArrayList<SurveyOptionVO>());

			BeanUtil.copyPropertie(itemPO, itemVO, Arrays.asList("options"));

			for (SurveyOptionPO optionPO : itemPO.getOptions()) {

				SurveyOptionVO optionVO = new SurveyOptionVO();

				BeanUtil.copyPropertie(optionPO, optionVO);

				itemVO.getOptions().add(optionVO);
			}

			surveyVO.getItems().add(itemVO);
		}

		return surveyVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendSurvey(SurveyVO surveyVO) {

		SurveyPO surveyPO = surveyDao.get(surveyVO.getSid());

		String orderId = surveyPO.getOrderId();

		surveyPO.setSendTime(DateUtil.getDateToTimestamp(new Date()));

		surveyDao.save(surveyPO);

		System.out.println(String.format("pages/survery/survery?sid=%s", surveyPO.getSid()));

		decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s, %s", orderId, surveyPO.getName()), String.format("pages/survey/survey?sid=%s", surveyPO.getSid()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeSurvey(SurveyVO surveyVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(surveyVO.getStid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		SurveyPO surveyPO = new SurveyPO();

		UserPO creater = userdDao.queryUserByUserId(userId);

		BeanUtil.copyProperties(surveyVO, surveyPO, Arrays.asList("creater"));

		surveyPO.setName(surveyTemplatePO.getName());
		surveyPO.setCreater(creater);
		surveyPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		surveyPO.setOrderId(surveyVO.getOrderId());
		surveyPO.setStid(surveyTemplatePO.getStid());
		surveyPO.setCompany(company);

		surveyDao.save(surveyPO);

		List<SurveyTemplateItemPO> surveyTemplateItemPOs = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO surveyTemplateItemPO : surveyTemplateItemPOs) {

			SurveyItemPO surveyItemPO = new SurveyItemPO();

			surveyItemPO.setName(surveyTemplateItemPO.getName());
			surveyItemPO.setContent(surveyTemplateItemPO.getContent());
			surveyItemPO.setType(surveyTemplateItemPO.getType());

			surveyItemPO.setSid(surveyPO.getSid());

			surveyItemDao.save(surveyItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT).contains(surveyTemplateItemPO.getType())) continue;

			List<SurveyTemplateOptionPO> surveyTemplateOptionPOs = surveyTemplateItemPO.getOptions();

			if (surveyTemplateOptionPOs == null) continue;

			for (SurveyTemplateOptionPO surveyTemplateOptionPO : surveyTemplateOptionPOs) {

				SurveyOptionPO surveyOptionPO = new SurveyOptionPO();

				surveyOptionPO.setTitle(surveyTemplateOptionPO.getTitle());

				surveyOptionPO.setSid(surveyPO.getSid());
				surveyOptionPO.setSiid(surveyItemPO.getSiid());
				surveyOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

				surveyOptionDao.save(surveyOptionPO);
			}
		}

		surveyVO.setSid(surveyPO.getSid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleSurvey(SurveyVO surveyVO) {

		SurveyPO surveyPO = surveyDao.get(surveyVO.getSid());

		BeanUtil.copyProperties(surveyVO, surveyPO, Arrays.asList("items"));

		List<SurveyItemVO> surveyitem = surveyVO.getItems();

		for (SurveyItemVO itemVO : surveyitem) {

			SurveyItemPO itemPO = surveyItemDao.get(itemVO.getSiid());

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT).contains(itemPO.getType())) {
				itemPO.setContent(itemVO.getContent());
			}

			surveyItemDao.update(itemPO);

			List<SurveyOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (SurveyOptionVO optionVO : options) {

				if (optionVO == null) continue;

				SurveyOptionPO optionPO = surveyOptionDao.get(optionVO.getSoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				surveyOptionDao.update(optionPO);
			}
		}

		surveyPO.setStatus(SurveyPO.STATUS_HANDLE_INT);

		surveyDao.update(surveyPO);
	}
}
