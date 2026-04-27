package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.common.dao.SurveyTemplateItemDao;
import com.fanglin.data.common.dao.SurveyTemplateOptionDao;
import com.fanglin.data.common.service.SurveyTemplateService;
import com.fanglin.data.common.vo.SurveyTemplateItemVO;
import com.fanglin.data.common.vo.SurveyTemplateOptionVO;
import com.fanglin.data.common.vo.SurveyTemplateVO;
import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.data.po.SurveyTemplateOptionPO;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("surveyTemplateService")
@Transactional(readOnly = true)
public class SurveyTemplateServiceImpl implements SurveyTemplateService {

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private SurveyTemplateItemDao surveyTemplateItemDao;

	@Autowired
	private SurveyTemplateOptionDao surveyTemplateOptionDao;

	public void pageSurveyTemplate(Paging paging, List<Filter> filters, int company) {

		List<SurveyTemplatePO> surveyTemplatePOs = surveyTemplateDao.pageSurveyTemplate(paging, filters, company);
		List<SurveyTemplateVO> surveyTemplateVOs = new ArrayList<SurveyTemplateVO>();

		for (SurveyTemplatePO surveyTemplatePO : surveyTemplatePOs) {
			SurveyTemplateVO surveyTemplateVO = new SurveyTemplateVO();

			BeanUtil.copyProperties(surveyTemplatePO, surveyTemplateVO, Arrays.asList("items"));

			surveyTemplateVOs.add(surveyTemplateVO);
		}
		paging.setData(surveyTemplateVOs);

	}

	@Override
	public List<SurveyTemplateVO> querySurveyTemplate(SurveyTemplateVO surveyTemplateVO, int company) {

		List<SurveyTemplatePO> surveyTemplatePOs = surveyTemplateDao.querySurveyTemplate(company, surveyTemplateVO.getName());
		List<SurveyTemplateVO> surveyTemplateVOs = new ArrayList<SurveyTemplateVO>();

		for (SurveyTemplatePO surveyTemplatePO : surveyTemplatePOs) {

			surveyTemplateVO = new SurveyTemplateVO();

			BeanUtil.copyProperties(surveyTemplatePO, surveyTemplateVO, Arrays.asList("items"));

			surveyTemplateVOs.add(surveyTemplateVO);
		}

		return surveyTemplateVOs;
	}

	@Override
	public SurveyTemplateVO querySurveyTemplateByStid(SurveyTemplateVO surveyTemplateVO) {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(surveyTemplateVO.getStid());

		surveyTemplateVO = new SurveyTemplateVO(new ArrayList<SurveyTemplateItemVO>());

		BeanUtil.copyProperties(surveyTemplatePO, surveyTemplateVO, Arrays.asList("items"));

		for (SurveyTemplateItemPO itemPO : surveyTemplatePO.getItems()) {

			SurveyTemplateItemVO itemVO = new SurveyTemplateItemVO(new ArrayList<SurveyTemplateOptionVO>());

			BeanUtil.copyPropertie(itemPO, itemVO, Arrays.asList("options"));

			for (SurveyTemplateOptionPO optionPO : itemPO.getOptions()) {

				SurveyTemplateOptionVO optionVO = new SurveyTemplateOptionVO();

				BeanUtil.copyPropertie(optionPO, optionVO);

				itemVO.getOptions().add(optionVO);
			}

			surveyTemplateVO.getItems().add(itemVO);
		}

		return surveyTemplateVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSurveyTemplate(SurveyTemplateVO surveyTemplateVO, int company) {

		SurveyTemplatePO surveyTemplatePO = new SurveyTemplatePO();

		BeanUtil.copyProperties(surveyTemplateVO, surveyTemplatePO, Arrays.asList("items"));

		surveyTemplatePO.setCompany(company);

		surveyTemplateDao.save(surveyTemplatePO);

		List<SurveyTemplateItemVO> items = surveyTemplateVO.getItems();

		for (SurveyTemplateItemVO itemVO : items) {

			SurveyTemplateItemPO itemPO = new SurveyTemplateItemPO();

			BeanUtil.copyPropertie(itemVO, itemPO, Arrays.asList("options"));
			itemPO.setStid(surveyTemplatePO.getStid());

			surveyTemplateItemDao.save(itemPO);

			if (itemVO.getType() == SurveyTemplateItemPO.TYPE_TEXT_INT || itemVO.getType() == SurveyTemplateItemPO.TYPE_INPUT_INT || itemVO.getType() == SurveyTemplateItemPO.TYPE_DATE_INT) continue;

			List<SurveyTemplateOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (SurveyTemplateOptionVO optionVO : options) {

				SurveyTemplateOptionPO optionPO = new SurveyTemplateOptionPO();

				BeanUtil.copyPropertie(optionVO, optionPO);

				optionPO.setStid(surveyTemplatePO.getStid());
				optionPO.setStiid(itemPO.getStiid());

				surveyTemplateOptionDao.save(optionPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSurveyTemplate(SurveyTemplateVO surveyTemplateVO) throws FLException {

		Long stid = surveyTemplateVO.getStid();
		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(stid);

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模版不存在");
		}

		surveyTemplatePO.setName(surveyTemplateVO.getName());

		surveyTemplateDao.update(surveyTemplatePO);

		surveyTemplateItemDao.deleteSurveyTemplateItemByStid(stid);
		surveyTemplateItemDao.deleteSurveyTemplateOptionByStid(stid);

		List<SurveyTemplateItemVO> items = surveyTemplateVO.getItems();

		for (SurveyTemplateItemVO itemVO : items) {

			SurveyTemplateItemPO itemPO = new SurveyTemplateItemPO();

			BeanUtil.copyPropertie(itemVO, itemPO, Arrays.asList("options"));

			itemPO.setStid(surveyTemplatePO.getStid());

			surveyTemplateItemDao.save(itemPO);

			if (itemVO.getType() == SurveyTemplateItemPO.TYPE_TEXT_INT || itemVO.getType() == SurveyTemplateItemPO.TYPE_INPUT_INT || itemVO.getType() == SurveyTemplateItemPO.TYPE_DATE_INT) continue;

			List<SurveyTemplateOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (SurveyTemplateOptionVO optionVO : options) {

				SurveyTemplateOptionPO optionPO = new SurveyTemplateOptionPO();

				BeanUtil.copyPropertie(optionVO, optionPO);

				optionPO.setStid(surveyTemplatePO.getStid());
				optionPO.setStiid(itemPO.getStiid());

				surveyTemplateOptionDao.save(optionPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSurveyTemplateForStatus(SurveyTemplateVO surveyTemplateVO) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(surveyTemplateVO.getStid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模版不存在");
		}

		if (surveyTemplateVO.getStatus() != null) {
			surveyTemplatePO.setStatus(surveyTemplateVO.getStatus());
		}

		if (surveyTemplateVO.getIsSend() != null) {
			surveyTemplatePO.setIsSend(surveyTemplateVO.getIsSend());
		}

		surveyTemplateDao.update(surveyTemplatePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSurveyTemplate(SurveyTemplateVO surveyTemplateVO) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(surveyTemplateVO.getStid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模版不存在");
		}

		surveyTemplateDao.delete(surveyTemplatePO);
		surveyTemplateItemDao.deleteSurveyTemplateItemByStid(surveyTemplateVO.getStid());
		surveyTemplateItemDao.deleteSurveyTemplateOptionByStid(surveyTemplateVO.getStid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copySurveyTemplate(SurveyTemplateVO surveyTemplate, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(surveyTemplate.getStid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模版不存在");
		}
		SurveyTemplatePO surveyTemplateNO = new SurveyTemplatePO();

		BeanUtil.copyProperties(surveyTemplatePO, surveyTemplateNO, Arrays.asList("items"));

		surveyTemplateDao.save(surveyTemplateNO);

		List<SurveyTemplateItemPO> items = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO itemPO : items) {

			SurveyTemplateItemPO newTemplateItem = new SurveyTemplateItemPO();

			BeanUtil.copyPropertie(itemPO, newTemplateItem, Arrays.asList("options"));

			newTemplateItem.setStid(surveyTemplateNO.getStid());

			surveyTemplateItemDao.save(newTemplateItem);
		}

		return 0;
	}

}
