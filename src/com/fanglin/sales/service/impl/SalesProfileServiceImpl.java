package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.po.CustomerProfileItemPO;
import com.fanglin.customer.po.SurveyOptionPO;
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.data.po.SurveyTemplateOptionPO;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesProfileDao;
import com.fanglin.sales.dao.SalesProfileItemDao;
import com.fanglin.sales.dao.SalesProfileOptionDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesProfileItemPO;
import com.fanglin.sales.po.SalesProfileOptionPO;
import com.fanglin.sales.po.SalesProfilePO;
import com.fanglin.sales.service.SalesProfileService;
import com.fanglin.sales.vo.SalesProfileItemVO;
import com.fanglin.sales.vo.SalesProfileOptionVO;
import com.fanglin.sales.vo.SalesProfileVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("salesProfileService")
@Transactional(readOnly = true)
public class SalesProfileServiceImpl implements SalesProfileService {

	@Autowired
	private SalesProfileDao salesProfileDao;

	@Autowired
	private SalesProfileItemDao salesProfileItemDao;

	@Autowired
	private SalesProfileOptionDao salesProfileOptionDao;

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private UserDao userdDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public SalesProfileVO querySalesProfileByOrderId(SalesProfileVO salesProfileVO) throws FLException {

		SalesProfilePO salesProfilePO = salesProfileDao.querySalesProfileByOrderId(salesProfileVO.getOrderId());

		if (salesProfilePO == null) {
			throw new FLException(370031, "销售满意度信息不存在");
		}

		salesProfileVO = salesProfilePO.ptv(new SalesProfileVO(new UserBaseVO(), new ArrayList<SalesProfileItemVO>()));

		return salesProfileVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public SalesProfileVO makeSalesProfile(SalesProfileVO salesProfileVO, String userId, int company) throws FLException {

		SalesProfilePO salesProfilePO = salesProfileDao.querySalesProfileByOrderId(salesProfileVO.getOrderId());

		if (salesProfilePO != null) {
			throw new FLException(370032, "销售满意度信息已存在");
		}

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(salesProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		salesProfilePO = new SalesProfilePO();

		UserPO creater = userdDao.queryUserByUserId(userId);

		String orderId = salesProfileVO.getOrderId();

		BeanUtil.copyProperties(salesProfileVO, salesProfilePO, Arrays.asList("creater"));

		salesProfilePO.setName(surveyTemplatePO.getName());
		salesProfilePO.setCreater(creater);
		salesProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesProfilePO.setOrderId(orderId);
		salesProfilePO.setTid(surveyTemplatePO.getStid());
		salesProfilePO.setType(SalesProfilePO.TYPE_DEFAULT_INT);
		salesProfilePO.setCompany(company);

		salesProfileDao.save(salesProfilePO);

		List<Long> bids = new ArrayList<Long>();

		List<SalesPO> salesPOs = salesProfileItemDao.querySalesByOrderId(orderId);

		for (SalesPO salesPO : salesPOs) {

			if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT && salesPO.getStatus() != SalesPO.STATUS_END_SHORT) continue;
			if (bids.contains(salesPO.getBrand().getBid())) continue;

			SalesProfileItemPO salesProfileItemPO = new SalesProfileItemPO();

			salesProfileItemPO.setName(String.format("%s", salesPO.getBrand().getName()));
			salesProfileItemPO.setContent(String.format("%s", salesPO.getBrand().getName()));
			salesProfileItemPO.setType(SurveyTemplateItemPO.TYPE_RADIO_INT);
			salesProfileItemPO.setSpid(salesProfilePO.getSpid());
			salesProfileItemPO.setBid(salesPO.getBrand().getBid());

			salesProfileItemDao.save(salesProfileItemPO);

			salesProfileItemDao.save(new SalesProfileItemPO().initInput(salesProfilePO.getSpid()));

			for (int i = 1; i <= 5; i++) {

				SalesProfileOptionPO salesProfileOptionPO = new SalesProfileOptionPO();

				salesProfileOptionPO.setTitle(String.format("%s分", i));

				salesProfileOptionPO.setSpid(salesProfilePO.getSpid());
				salesProfileOptionPO.setSpiid(salesProfileItemPO.getSpiid());
				salesProfileOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

				salesProfileOptionDao.save(salesProfileOptionPO);
			}

			bids.add(salesPO.getBrand().getBid());
		}

		List<SurveyTemplateItemPO> surveyTemplateItemPOs = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO surveyTemplateItemPO : surveyTemplateItemPOs) {

			SalesProfileItemPO salesProfileItemPO = new SalesProfileItemPO();

			salesProfileItemPO.setName(surveyTemplateItemPO.getName());
			salesProfileItemPO.setContent(surveyTemplateItemPO.getContent());
			salesProfileItemPO.setType(surveyTemplateItemPO.getType());
			salesProfileItemPO.setRequire(surveyTemplateItemPO.getRequire());
			salesProfileItemPO.setSpid(salesProfilePO.getSpid());

			salesProfileItemDao.save(salesProfileItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT).contains(surveyTemplateItemPO.getType())) continue;

			List<SurveyTemplateOptionPO> surveyTemplateOptionPOs = surveyTemplateItemPO.getOptions();

			if (surveyTemplateOptionPOs == null) continue;

			for (SurveyTemplateOptionPO surveyTemplateOptionPO : surveyTemplateOptionPOs) {

				SalesProfileOptionPO salesProfileOptionPO = new SalesProfileOptionPO();

				salesProfileOptionPO.setTitle(surveyTemplateOptionPO.getTitle());

				salesProfileOptionPO.setSpid(salesProfilePO.getSpid());
				salesProfileOptionPO.setSpiid(salesProfileItemPO.getSpiid());
				salesProfileOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

				salesProfileOptionDao.save(salesProfileOptionPO);
			}
		}

		return salesProfilePO.ptv(new SalesProfileVO(new UserBaseVO(), new ArrayList<SalesProfileItemVO>()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleSalesProfile(SalesProfileVO salesProfileVO) throws FLException {

		SalesProfilePO salesProfilePO = salesProfileDao.get(salesProfileVO.getSpid());

		if (salesProfilePO == null) {
			throw new FLException(370030, "销售满意度信息不存在");
		}

		if (salesProfileVO.getItems() == null) {
			throw new FLException(370030, "销售满意度信息不存在");
		}

		List<SalesProfileItemVO> salesProfileItems = salesProfileVO.getItems();

		for (SalesProfileItemVO itemVO : salesProfileItems) {

			SalesProfileItemPO itemPO = salesProfileItemDao.get(itemVO.getSpiid());

			if (Arrays.asList(CustomerProfileItemPO.TYPE_TEXT_INT, CustomerProfileItemPO.TYPE_INPUT_INT).contains(itemPO.getType())) {
				itemPO.setContent(itemVO.getContent());
				salesProfileItemDao.update(itemPO);
			}

			List<SalesProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (SalesProfileOptionVO optionVO : options) {

				if (optionVO == null) continue;

				SalesProfileOptionPO optionPO = salesProfileOptionDao.get(optionVO.getSpoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				salesProfileOptionDao.update(optionPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSalesProfileBrand(SalesProfileVO salesProfileVO) throws FLException {

		BrandPO brand = brandDao.get(salesProfileVO.getBid());

		if (brand == null) {
			throw new FLException(130077, "品牌不存在");
		}

		SalesProfileItemPO salesProfileItemPO = new SalesProfileItemPO();

		salesProfileItemPO.setName(String.format("%s", brand.getName()));
		salesProfileItemPO.setContent(String.format("%s", brand.getName()));
		salesProfileItemPO.setType(SurveyTemplateItemPO.TYPE_RADIO_INT);
		salesProfileItemPO.setSpid(salesProfileVO.getSpid());
		salesProfileItemPO.setBid(salesProfileVO.getBid());

		salesProfileItemDao.save(salesProfileItemPO);

		salesProfileItemDao.save(new SalesProfileItemPO().initInput(salesProfileVO.getSpid()));

		for (int i = 1; i <= 5; i++) {

			SalesProfileOptionPO salesProfileOptionPO = new SalesProfileOptionPO();

			salesProfileOptionPO.setTitle(String.format("%s分", i));

			salesProfileOptionPO.setSpid(salesProfileVO.getSpid());
			salesProfileOptionPO.setSpiid(salesProfileItemPO.getSpiid());
			salesProfileOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

			salesProfileOptionDao.save(salesProfileOptionPO);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSalesProfileBrand(SalesProfileVO salesProfileVO) throws FLException {

		List<SalesPO> salesPOs = salesProfileItemDao.querySalesByOrderId(salesProfileVO.getOrderId());
		List<Long> bids = new ArrayList<Long>();
		for (SalesPO salesPO : salesPOs) {

			if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT && salesPO.getStatus() != SalesPO.STATUS_END_SHORT) continue;
			if (bids.contains(salesPO.getBrand().getBid())) continue;

			SalesProfileItemPO salesProfileItemPO = new SalesProfileItemPO();

			salesProfileItemPO.setName(String.format("%s", salesPO.getBrand().getName()));
			salesProfileItemPO.setContent(String.format("%s", salesPO.getBrand().getName()));
			salesProfileItemPO.setType(SurveyTemplateItemPO.TYPE_RADIO_INT);
			salesProfileItemPO.setSpid(salesProfileVO.getSpid());
			salesProfileItemPO.setBid(salesPO.getBrand().getBid());

			salesProfileItemDao.save(salesProfileItemPO);

			salesProfileItemDao.save(new SalesProfileItemPO().initInput(salesProfileVO.getSpid()));

			for (int i = 1; i <= 5; i++) {

				SalesProfileOptionPO salesProfileOptionPO = new SalesProfileOptionPO();

				salesProfileOptionPO.setTitle(String.format("%s分", i));

				salesProfileOptionPO.setSpid(salesProfileVO.getSpid());
				salesProfileOptionPO.setSpiid(salesProfileItemPO.getSpiid());
				salesProfileOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

				salesProfileOptionDao.save(salesProfileOptionPO);
			}

			bids.add(salesPO.getBrand().getBid());
		}

	}

}
