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
import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.dao.DrawlineProfileDao;
import com.fanglin.construction.dao.DrawlineProfileItemDao;
import com.fanglin.construction.dao.DrawlineProfileOptionDao;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.construction.po.DrawlineProfileItemPO;
import com.fanglin.construction.po.DrawlineProfileOptionPO;
import com.fanglin.construction.po.DrawlineProfilePO;
import com.fanglin.construction.service.DrawlineProfileService;
import com.fanglin.construction.vo.DrawlineProfileItemVO;
import com.fanglin.construction.vo.DrawlineProfileOptionVO;
import com.fanglin.construction.vo.DrawlineProfileVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("drawlineProfileService")
@Transactional(readOnly = true)
public class DrawlineProfileServiceImpl implements DrawlineProfileService {

	@Autowired
	private DrawlineProfileDao drawlineProfileDao;

	@Autowired
	private DrawlineProfileItemDao drawlineProfileItemDao;

	@Autowired
	private DrawlineProfileOptionDao drawlineProfileOptionDao;

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DrawLineDao drawLineDao;

	@Override
	public void pageDrawlineProfile(Paging paging, List<Filter> filters, int company) {

		List<DrawlineProfilePO> drawlineProfilePOs = drawlineProfileDao.pageDrawlineProfile(paging, filters, company);
		List<DrawlineProfileVO> drawlineProfileVOs = new ArrayList<DrawlineProfileVO>();

		for (DrawlineProfilePO drawlineProfilePO : drawlineProfilePOs) {
			drawlineProfileVOs.add(drawlineProfilePO.ptv(new DrawlineProfileVO(new UserBaseVO())));
		}

		paging.setData(drawlineProfileVOs);
	}

	@Override
	public List<DrawlineProfileVO> queryDrawlineProfileByDlid(DrawlineProfileVO drawlineProfileVO) throws FLException {

		List<DrawlineProfilePO> drawlineProfilePOs = drawlineProfileDao.queryDrawlineProfileByDlid(drawlineProfileVO.getDlid(), drawlineProfileVO.getType());
		List<DrawlineProfileVO> drawlineProfileVOs = new ArrayList<DrawlineProfileVO>();

		for (DrawlineProfilePO drawlineProfilePO : drawlineProfilePOs) {
			drawlineProfileVOs.add(drawlineProfilePO.ptv(new DrawlineProfileVO(new ArrayList<DrawlineProfileItemVO>(), new UserBaseVO())));
		}

		return drawlineProfileVOs;
	}

	@Override
	public List<DrawlineProfileVO> queryDrawlineProfileByOrderId(DrawlineProfileVO drawlineProfileVO) throws FLException {

		List<DrawlineProfilePO> drawlineProfilePOs = drawlineProfileDao.queryDrawlineProfileByOrderId(drawlineProfileVO.getOrderId(), drawlineProfileVO.getType());
		List<DrawlineProfileVO> drawlineProfileVOs = new ArrayList<DrawlineProfileVO>();

		for (DrawlineProfilePO drawlineProfilePO : drawlineProfilePOs) {
			drawlineProfileVOs.add(drawlineProfilePO.ptv(new DrawlineProfileVO(new ArrayList<DrawlineProfileItemVO>(), new UserBaseVO())));
		}

		return drawlineProfileVOs;
	}

	@Override
	public DrawlineProfileVO queryDrawlineProfileByDpid(DrawlineProfileVO drawlineProfileVO) throws FLException {

		DrawlineProfilePO drawlineProfilePO = drawlineProfileDao.get(drawlineProfileVO.getDpid());

		if (drawlineProfilePO == null) {
			throw new FLException(330111, "放线配置不存在");
		}

		drawlineProfileVO = drawlineProfilePO.ptv(new DrawlineProfileVO(new ArrayList<DrawlineProfileItemVO>(), new UserBaseVO()));

		return drawlineProfileVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDrawlineProfile(DrawlineProfileVO drawlineProfileVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(drawlineProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		if (drawlineProfileVO.getItems() == null) {
			throw new FLException(330111, "放线配置不存在");
		}

		DrawlineProfilePO drawlineProfilePO = new DrawlineProfilePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		String orderId = drawlineProfileVO.getOrderId();

		BeanUtil.copyProperties(drawlineProfileVO, drawlineProfilePO, Arrays.asList("creater"));

		drawlineProfilePO.setName(surveyTemplatePO.getName());
		drawlineProfilePO.setCreater(creater);
		drawlineProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		drawlineProfilePO.setOrderId(orderId);
		drawlineProfilePO.setTid(surveyTemplatePO.getStid());
		if (drawlineProfileVO.getType() != null) {
			drawlineProfilePO.setType(drawlineProfileVO.getType());
		}
		drawlineProfilePO.setCompany(company);
		drawlineProfilePO.setStatus(DrawlineProfilePO.STATUS_INIT_INT);

		drawlineProfileDao.save(drawlineProfilePO);

		List<DrawlineProfileItemVO> drawlineProfileItems = drawlineProfileVO.getItems();

		for (DrawlineProfileItemVO itemVO : drawlineProfileItems) {

			DrawlineProfileItemPO drawlineProfileItemPO = new DrawlineProfileItemPO();

			drawlineProfileItemPO.setName(itemVO.getName());
			drawlineProfileItemPO.setContent(itemVO.getContent());
			drawlineProfileItemPO.setType(itemVO.getType());
			drawlineProfileItemPO.setRequire(itemVO.getRequire());

			drawlineProfileItemPO.setDpid(drawlineProfilePO.getDpid());

			drawlineProfileItemDao.save(drawlineProfileItemPO);

			if (Arrays.asList(DrawlineProfileItemPO.TYPE_TEXT_INT, DrawlineProfileItemPO.TYPE_INPUT_INT, DrawlineProfileItemPO.TYPE_DATE_INT).contains(itemVO.getType())) continue;

			List<DrawlineProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (DrawlineProfileOptionVO optionVO : options) {

				DrawlineProfileOptionPO drawlineProfileOptionPO = new DrawlineProfileOptionPO();

				drawlineProfileOptionPO.setDpid(drawlineProfilePO.getDpid());
				drawlineProfileOptionPO.setDpiid(drawlineProfileItemPO.getDpiid());
				drawlineProfileOptionPO.setTitle(optionVO.getTitle());
				drawlineProfileOptionPO.setChecked(optionVO.getChecked());

				drawlineProfileOptionDao.save(drawlineProfileOptionPO);
			}
		}

		drawlineProfileVO.setDpid(drawlineProfilePO.getDpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDrawlineProfile(DrawlineProfileVO drawlineProfileVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(drawlineProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		DrawlineProfilePO drawlineProfilePO = new DrawlineProfilePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		String orderId = drawlineProfileVO.getOrderId();

		// 若未显式传入 dlid, 则按 orderId 反查放线单补全关联
		long dlid = drawlineProfileVO.getDlid() == null ? 0 : drawlineProfileVO.getDlid();
		if (dlid == 0 && orderId != null) {
			DrawLinePO drawLinePO = drawLineDao.queryDrawLineByOrderId(orderId);
			if (drawLinePO != null) {
				dlid = drawLinePO.getDlid();
			}
		}

		BeanUtil.copyProperties(drawlineProfileVO, drawlineProfilePO, Arrays.asList("creater"));

		drawlineProfilePO.setName(surveyTemplatePO.getName());
		drawlineProfilePO.setCreater(creater);
		drawlineProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		drawlineProfilePO.setOrderId(orderId);
		drawlineProfilePO.setDlid(dlid);
		drawlineProfilePO.setTid(surveyTemplatePO.getStid());
		if (drawlineProfileVO.getType() != null) {
			drawlineProfilePO.setType(drawlineProfileVO.getType());
		}
		drawlineProfilePO.setCompany(company);

		drawlineProfileDao.save(drawlineProfilePO);

		if (surveyTemplatePO.getIsSend() == SurveyTemplatePO.ISSEND_AUTOMATIC_INT) {
			drawlineProfilePO.setStatus(DrawlineProfilePO.STATUS_SEND_INT);
		} else {
			drawlineProfilePO.setStatus(DrawlineProfilePO.STATUS_INIT_INT);
		}

		drawlineProfileDao.update(drawlineProfilePO);

		List<SurveyTemplateItemPO> surveyTemplateItemPOs = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO surveyTemplateItemPO : surveyTemplateItemPOs) {

			DrawlineProfileItemPO drawlineProfileItemPO = new DrawlineProfileItemPO();

			drawlineProfileItemPO.setName(surveyTemplateItemPO.getName());
			drawlineProfileItemPO.setContent(surveyTemplateItemPO.getContent());
			drawlineProfileItemPO.setType(surveyTemplateItemPO.getType());
			drawlineProfileItemPO.setRequire(surveyTemplateItemPO.getRequire());

			drawlineProfileItemPO.setDpid(drawlineProfilePO.getDpid());

			drawlineProfileItemDao.save(drawlineProfileItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT, SurveyTemplateItemPO.TYPE_DATE_INT).contains(surveyTemplateItemPO.getType())) continue;

			List<SurveyTemplateOptionPO> surveyTemplateOptionPOs = surveyTemplateItemPO.getOptions();

			if (surveyTemplateOptionPOs == null) continue;

			for (SurveyTemplateOptionPO surveyTemplateOptionPO : surveyTemplateOptionPOs) {

				DrawlineProfileOptionPO drawlineProfileOptionPO = new DrawlineProfileOptionPO();

				drawlineProfileOptionPO.setTitle(surveyTemplateOptionPO.getTitle());

				drawlineProfileOptionPO.setDpid(drawlineProfilePO.getDpid());
				drawlineProfileOptionPO.setDpiid(drawlineProfileItemPO.getDpiid());
				drawlineProfileOptionPO.setChecked(DrawlineProfileOptionPO.CHECKED_INIT_INT);

				drawlineProfileOptionDao.save(drawlineProfileOptionPO);
			}
		}

		drawlineProfileVO.setDpid(drawlineProfilePO.getDpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleDrawlineProfile(DrawlineProfileVO drawlineProfileVO) throws FLException {
		if (drawlineProfileVO == null || drawlineProfileVO.getItems() == null) {
			throw new FLException(330111, "放线配置不存在");
		}

		List<DrawlineProfileItemVO> drawlineProfileItems = drawlineProfileVO.getItems();

		for (DrawlineProfileItemVO itemVO : drawlineProfileItems) {

			DrawlineProfileItemPO itemPO = drawlineProfileItemDao.get(itemVO.getDpiid());
			if (itemPO == null) continue;

			if (Arrays.asList(DrawlineProfileItemPO.TYPE_TEXT_INT, DrawlineProfileItemPO.TYPE_INPUT_INT, DrawlineProfileItemPO.TYPE_DATE_INT).contains(itemPO.getType())) {
				itemPO.setContent(itemVO.getContent());
				drawlineProfileItemDao.update(itemPO);
			}

			List<DrawlineProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;
			for (DrawlineProfileOptionVO optionVO : options) {

				if (optionVO == null) continue;

				DrawlineProfileOptionPO optionPO = drawlineProfileOptionDao.get(optionVO.getDpoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				drawlineProfileOptionDao.update(optionPO);
			}
		}
	}

}
