package com.fanglin.construction.service.impl;

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
import com.fanglin.construction.dao.ConstructionProfileDao;
import com.fanglin.construction.dao.ConstructionProfileItemDao;
import com.fanglin.construction.dao.ConstructionProfileOptionDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionProfileItemPO;
import com.fanglin.construction.po.ConstructionProfileOptionPO;
import com.fanglin.construction.po.ConstructionProfilePO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.ConstructionProfileService;
import com.fanglin.construction.vo.ConstructionProfileItemVO;
import com.fanglin.construction.vo.ConstructionProfileOptionVO;
import com.fanglin.construction.vo.ConstructionProfileVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("constructionProfileService")
@Transactional(readOnly = true)
public class ConstructionProfileServiceImpl implements ConstructionProfileService {

	@Autowired
	private ConstructionProfileDao constructionProfileDao;

	@Autowired
	private ConstructionProfileItemDao constructionProfileItemDao;

	@Autowired
	private ConstructionProfileOptionDao constructionProfileOptionDao;

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Override
	public void pageConstructionProfile(Paging paging, List<Filter> filters, int company) {

		List<ConstructionProfilePO> constructionProfilePOs = constructionProfileDao.pageConstructionProfile(paging, filters, company);
		List<ConstructionProfileVO> constructionProfileVOs = new ArrayList<ConstructionProfileVO>();

		for (ConstructionProfilePO constructionProfilePO : constructionProfilePOs) {
			constructionProfileVOs.add(constructionProfilePO.ptv(new ConstructionProfileVO(new UserBaseVO())));
		}

		paging.setData(constructionProfileVOs);
	}

	@Override
	public List<ConstructionProfileVO> queryConstructionProfileByCid(ConstructionProfileVO constructionProfileVO) throws FLException {

		List<ConstructionProfilePO> constructionProfilePOs = constructionProfileDao.queryConstructionProfileByCid(constructionProfileVO.getCid(), constructionProfileVO.getType());
		List<ConstructionProfileVO> constructionProfileVOs = new ArrayList<ConstructionProfileVO>();

		for (ConstructionProfilePO constructionProfilePO : constructionProfilePOs) {
			constructionProfileVOs.add(constructionProfilePO.ptv(new ConstructionProfileVO(new ArrayList<ConstructionProfileItemVO>(), new UserBaseVO())));
		}

		return constructionProfileVOs;
	}

	@Override
	public List<ConstructionProfileVO> queryConstructionProfileByOrderId(ConstructionProfileVO constructionProfileVO) throws FLException {

		List<ConstructionProfilePO> constructionProfilePOs = constructionProfileDao.queryConstructionProfileByOrderId(constructionProfileVO.getOrderId(), constructionProfileVO.getType());
		List<ConstructionProfileVO> constructionProfileVOs = new ArrayList<ConstructionProfileVO>();

		for (ConstructionProfilePO constructionProfilePO : constructionProfilePOs) {
			constructionProfileVOs.add(constructionProfilePO.ptv(new ConstructionProfileVO(new ArrayList<ConstructionProfileItemVO>(), new UserBaseVO())));
		}

		return constructionProfileVOs;
	}

	@Override
	public ConstructionProfileVO queryConstructionProfileByCpid(ConstructionProfileVO constructionProfileVO) throws FLException {

		ConstructionProfilePO constructionProfilePO = constructionProfileDao.get(constructionProfileVO.getCpid());

		if (constructionProfilePO == null) {
			throw new FLException(330087, "工程配置不存在");
		}

		constructionProfileVO = constructionProfilePO.ptv(new ConstructionProfileVO(new ArrayList<ConstructionProfileItemVO>(), new UserBaseVO()));

		return constructionProfileVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstructionProfile(ConstructionProfileVO constructionProfileVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(constructionProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		if (constructionProfileVO.getItems() == null) {
			throw new FLException(330087, "工程配置不存在");
		}

		ConstructionProfilePO constructionProfilePO = new ConstructionProfilePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		String orderId = constructionProfileVO.getOrderId();

		BeanUtil.copyProperties(constructionProfileVO, constructionProfilePO, Arrays.asList("creater"));

		constructionProfilePO.setName(surveyTemplatePO.getName());
		constructionProfilePO.setCreater(creater);
		constructionProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		constructionProfilePO.setOrderId(orderId);
		constructionProfilePO.setTid(surveyTemplatePO.getStid());
		if (constructionProfileVO.getType() != null) {
			constructionProfilePO.setType(constructionProfileVO.getType());
		}
		constructionProfilePO.setCompany(company);
		constructionProfilePO.setStatus(ConstructionProfilePO.STATUS_INIT_INT);

		constructionProfileDao.save(constructionProfilePO);

		List<ConstructionProfileItemVO> constructionProfileItems = constructionProfileVO.getItems();

		for (ConstructionProfileItemVO itemVO : constructionProfileItems) {

			ConstructionProfileItemPO constructionProfileItemPO = new ConstructionProfileItemPO();

			constructionProfileItemPO.setName(itemVO.getName());
			constructionProfileItemPO.setContent(itemVO.getContent());
			constructionProfileItemPO.setType(itemVO.getType());
			constructionProfileItemPO.setRequire(itemVO.getRequire());

			constructionProfileItemPO.setCpid(constructionProfilePO.getCpid());

			constructionProfileItemDao.save(constructionProfileItemPO);

			if (Arrays.asList(ConstructionProfileItemPO.TYPE_TEXT_INT, ConstructionProfileItemPO.TYPE_INPUT_INT, ConstructionProfileItemPO.TYPE_DATE_INT).contains(itemVO.getType())) continue;

			List<ConstructionProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (ConstructionProfileOptionVO optionVO : options) {

				ConstructionProfileOptionPO constructionProfileOptionPO = new ConstructionProfileOptionPO();

				constructionProfileOptionPO.setCpid(constructionProfilePO.getCpid());
				constructionProfileOptionPO.setCpiid(constructionProfileItemPO.getCpiid());
				constructionProfileOptionPO.setTitle(optionVO.getTitle());
				constructionProfileOptionPO.setChecked(optionVO.getChecked());

				constructionProfileOptionDao.save(constructionProfileOptionPO);
			}
		}

		constructionProfileVO.setCpid(constructionProfilePO.getCpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeConstructionProfile(ConstructionProfileVO constructionProfileVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(constructionProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		ConstructionProfilePO constructionProfilePO = new ConstructionProfilePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		String orderId = constructionProfileVO.getOrderId();

		// 若未显式传入 cid, 则按 orderId 反查工程单补全关联
		long cid = constructionProfileVO.getCid() == null ? 0 : constructionProfileVO.getCid();
		if (cid == 0 && orderId != null) {
			ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);
			if (constructionPO != null) {
				cid = constructionPO.getCid();
			}
		}

		BeanUtil.copyProperties(constructionProfileVO, constructionProfilePO, Arrays.asList("creater"));

		constructionProfilePO.setName(surveyTemplatePO.getName());
		constructionProfilePO.setCreater(creater);
		constructionProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		constructionProfilePO.setOrderId(orderId);
		constructionProfilePO.setCid(cid);
		constructionProfilePO.setTid(surveyTemplatePO.getStid());
		if (constructionProfileVO.getType() != null) {
			constructionProfilePO.setType(constructionProfileVO.getType());
		}
		constructionProfilePO.setCompany(company);

		constructionProfileDao.save(constructionProfilePO);

		if (surveyTemplatePO.getIsSend() == SurveyTemplatePO.ISSEND_AUTOMATIC_INT) {
			constructionProfilePO.setStatus(ConstructionProfilePO.STATUS_SEND_INT);
		} else {
			constructionProfilePO.setStatus(ConstructionProfilePO.STATUS_INIT_INT);
		}

		constructionProfileDao.update(constructionProfilePO);

		List<SurveyTemplateItemPO> surveyTemplateItemPOs = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO surveyTemplateItemPO : surveyTemplateItemPOs) {

			ConstructionProfileItemPO constructionProfileItemPO = new ConstructionProfileItemPO();

			constructionProfileItemPO.setName(surveyTemplateItemPO.getName());
			constructionProfileItemPO.setContent(surveyTemplateItemPO.getContent());
			constructionProfileItemPO.setType(surveyTemplateItemPO.getType());
			constructionProfileItemPO.setRequire(surveyTemplateItemPO.getRequire());

			constructionProfileItemPO.setCpid(constructionProfilePO.getCpid());

			constructionProfileItemDao.save(constructionProfileItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT, SurveyTemplateItemPO.TYPE_DATE_INT).contains(surveyTemplateItemPO.getType())) continue;

			List<SurveyTemplateOptionPO> surveyTemplateOptionPOs = surveyTemplateItemPO.getOptions();

			if (surveyTemplateOptionPOs == null) continue;

			for (SurveyTemplateOptionPO surveyTemplateOptionPO : surveyTemplateOptionPOs) {

				ConstructionProfileOptionPO constructionProfileOptionPO = new ConstructionProfileOptionPO();

				constructionProfileOptionPO.setTitle(surveyTemplateOptionPO.getTitle());

				constructionProfileOptionPO.setCpid(constructionProfilePO.getCpid());
				constructionProfileOptionPO.setCpiid(constructionProfileItemPO.getCpiid());
				constructionProfileOptionPO.setChecked(ConstructionProfileOptionPO.CHECKED_INIT_INT);

				constructionProfileOptionDao.save(constructionProfileOptionPO);
			}
		}

		constructionProfileVO.setCpid(constructionProfilePO.getCpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleConstructionProfile(ConstructionProfileVO constructionProfileVO) throws FLException {
		if (constructionProfileVO == null || constructionProfileVO.getItems() == null) {
			throw new FLException(330087, "工程配置不存在");
		}

		List<ConstructionProfileItemVO> constructionProfileItems = constructionProfileVO.getItems();

		for (ConstructionProfileItemVO itemVO : constructionProfileItems) {

			ConstructionProfileItemPO itemPO = constructionProfileItemDao.get(itemVO.getCpiid());
			if (itemPO == null) continue;

			if (Arrays.asList(ConstructionProfileItemPO.TYPE_TEXT_INT, ConstructionProfileItemPO.TYPE_INPUT_INT, ConstructionProfileItemPO.TYPE_DATE_INT).contains(itemPO.getType())) {
				itemPO.setContent(itemVO.getContent());
				constructionProfileItemDao.update(itemPO);
			}

			List<ConstructionProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;
			for (ConstructionProfileOptionVO optionVO : options) {

				if (optionVO == null) continue;

				ConstructionProfileOptionPO optionPO = constructionProfileOptionDao.get(optionVO.getCpoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				constructionProfileOptionDao.update(optionPO);
			}
		}
	}

}
