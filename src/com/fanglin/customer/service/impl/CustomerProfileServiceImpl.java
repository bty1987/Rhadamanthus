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
import com.fanglin.customer.dao.CustomerProfileDao;
import com.fanglin.customer.dao.CustomerProfileItemDao;
import com.fanglin.customer.dao.CustomerProfileOptionDao;
import com.fanglin.customer.po.CustomerProfileItemPO;
import com.fanglin.customer.po.CustomerProfileOptionPO;
import com.fanglin.customer.po.CustomerProfilePO;
import com.fanglin.customer.po.SurveyOptionPO;
import com.fanglin.customer.po.SurveyPO;
import com.fanglin.customer.service.CustomerProfileService;
import com.fanglin.customer.vo.CustomerProfileItemVO;
import com.fanglin.customer.vo.CustomerProfileOptionVO;
import com.fanglin.customer.vo.CustomerProfileVO;
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.data.po.SurveyTemplateOptionPO;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerProfileService")
@Transactional(readOnly = true)
public class CustomerProfileServiceImpl implements CustomerProfileService {

	@Autowired
	private CustomerProfileDao customerProfileDao;

	@Autowired
	private CustomerProfileItemDao customerProfileItemDao;

	@Autowired
	private CustomerProfileOptionDao customerProfileOptionDao;

	@Autowired
	private SurveyTemplateDao surveyTemplateDao;

	@Autowired
	private UserDao userdDao;

	@Override
	public void pageCustomerProfile(Paging paging, List<Filter> filters, int company) {

		List<CustomerProfilePO> customerProfilePOs = customerProfileDao.pageCustomerProfile(paging, filters, company);
		List<CustomerProfileVO> customerProfileVOs = new ArrayList<CustomerProfileVO>();

		for (CustomerProfilePO customerProfilePO : customerProfilePOs) {

			CustomerProfileVO customerProfileVO = new CustomerProfileVO(new ArrayList<CustomerProfileItemVO>(), new UserBaseVO());

			BeanUtil.copyProperties(customerProfilePO, customerProfileVO, Arrays.asList("items", "creater"));

			customerProfileVO.getCreater().setBaseInfo(customerProfilePO.getCreater());

			customerProfileVOs.add(customerProfileVO);
		}

		paging.setData(customerProfileVOs);
	}

	@Override
	public CustomerProfileVO queryCustomerProfileByOrderId(CustomerProfileVO customerProfileVO) {

		CustomerProfilePO customerProfilePO = customerProfileDao.queryCustomerProfileByOrderId(customerProfileVO.getOrderId());

		customerProfileVO = new CustomerProfileVO(new ArrayList<CustomerProfileItemVO>(), new UserBaseVO());

		BeanUtil.copyProperties(customerProfilePO, customerProfileVO, Arrays.asList("items", "creater"));

		customerProfileVO.getCreater().setBaseInfo(customerProfilePO.getCreater());

		for (CustomerProfileItemPO itemPO : customerProfilePO.getItems()) {

			CustomerProfileItemVO itemVO = new CustomerProfileItemVO(new ArrayList<CustomerProfileOptionVO>());

			BeanUtil.copyPropertie(itemPO, itemVO, Arrays.asList("options"));

			for (CustomerProfileOptionPO optionPO : itemPO.getOptions()) {

				CustomerProfileOptionVO optionVO = new CustomerProfileOptionVO();

				BeanUtil.copyPropertie(optionPO, optionVO);

				itemVO.getOptions().add(optionVO);
			}

			customerProfileVO.getItems().add(itemVO);
		}

		return customerProfileVO;
	}

	@Override
	public CustomerProfileVO queryCustomerProfileByCpid(CustomerProfileVO customerProfileVO) {

		CustomerProfilePO customerProfilePO = customerProfileDao.get(customerProfileVO.getCpid());

		customerProfileVO = new CustomerProfileVO(new ArrayList<CustomerProfileItemVO>(), new UserBaseVO());

		BeanUtil.copyProperties(customerProfilePO, customerProfileVO, Arrays.asList("items", "creater"));

		customerProfileVO.getCreater().setBaseInfo(customerProfilePO.getCreater());

		for (CustomerProfileItemPO itemPO : customerProfilePO.getItems()) {

			CustomerProfileItemVO itemVO = new CustomerProfileItemVO(new ArrayList<CustomerProfileOptionVO>());

			BeanUtil.copyPropertie(itemPO, itemVO, Arrays.asList("options"));

			for (CustomerProfileOptionPO optionPO : itemPO.getOptions()) {

				CustomerProfileOptionVO optionVO = new CustomerProfileOptionVO();

				BeanUtil.copyPropertie(optionPO, optionVO);

				itemVO.getOptions().add(optionVO);
			}

			customerProfileVO.getItems().add(itemVO);
		}

		return customerProfileVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeCustomerProfile(CustomerProfileVO customerProfileVO, String userId, int company) throws FLException {

		SurveyTemplatePO surveyTemplatePO = surveyTemplateDao.get(customerProfileVO.getTid());

		if (surveyTemplatePO == null) {
			throw new FLException(130096, "调研模板不存在");
		}

		CustomerProfilePO customerProfilePO = new CustomerProfilePO();

		UserPO creater = userdDao.queryUserByUserId(userId);

		String orderId = customerProfileVO.getOrderId();

		BeanUtil.copyProperties(customerProfileVO, customerProfilePO, Arrays.asList("creater"));

		customerProfilePO.setName(surveyTemplatePO.getName());
		customerProfilePO.setCreater(creater);
		customerProfilePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		customerProfilePO.setOrderId(orderId);
		customerProfilePO.setTid(surveyTemplatePO.getStid());
		customerProfilePO.setCompany(company);

		customerProfileDao.save(customerProfilePO);

		if (surveyTemplatePO.getIsSend() == SurveyTemplatePO.ISSEND_AUTOMATIC_INT) {
			customerProfilePO.setStatus(SurveyPO.STATUS_SEND_INT);

			System.out.println(String.format("pages/customer/survery/survery?sid=%s", customerProfilePO.getTid()));

		} else {
			customerProfilePO.setStatus(CustomerProfilePO.STATUS_INIT_INT);
		}

		customerProfileDao.update(customerProfilePO);

		List<SurveyTemplateItemPO> surveyTemplateItemPOs = surveyTemplatePO.getItems();

		for (SurveyTemplateItemPO surveyTemplateItemPO : surveyTemplateItemPOs) {

			CustomerProfileItemPO customerProfileItemPO = new CustomerProfileItemPO();

			customerProfileItemPO.setName(surveyTemplateItemPO.getName());
			customerProfileItemPO.setContent(surveyTemplateItemPO.getContent());
			customerProfileItemPO.setType(surveyTemplateItemPO.getType());

			customerProfileItemPO.setCpid(customerProfilePO.getCpid());

			customerProfileItemDao.save(customerProfileItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT).contains(surveyTemplateItemPO.getType())) continue;

			List<SurveyTemplateOptionPO> surveyTemplateOptionPOs = surveyTemplateItemPO.getOptions();

			if (surveyTemplateOptionPOs == null) continue;

			for (SurveyTemplateOptionPO surveyTemplateOptionPO : surveyTemplateOptionPOs) {

				CustomerProfileOptionPO customerProfileOptionPO = new CustomerProfileOptionPO();

				customerProfileOptionPO.setTitle(surveyTemplateOptionPO.getTitle());

				customerProfileOptionPO.setCpid(customerProfilePO.getCpid());
				customerProfileOptionPO.setCpiid(customerProfileItemPO.getCpiid());
				customerProfileOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

				customerProfileOptionDao.save(customerProfileOptionPO);
			}
		}

		customerProfileVO.setCpid(customerProfilePO.getCpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleCustomerProfile(CustomerProfileVO customerProfileVO) throws FLException {

		CustomerProfilePO customerProfilePO = customerProfileDao.get(customerProfileVO.getCpid());

		if (customerProfilePO == null) {
			throw new FLException(330058, "调研不存在");
		}

		BeanUtil.copyProperties(customerProfileVO, customerProfilePO, Arrays.asList("items"));

		List<CustomerProfileItemVO> customerProfileItems = customerProfileVO.getItems();

		for (CustomerProfileItemVO itemVO : customerProfileItems) {

			CustomerProfileItemPO itemPO = customerProfileItemDao.get(itemVO.getCpiid());

			if (Arrays.asList(CustomerProfileItemPO.TYPE_TEXT_INT, CustomerProfileItemPO.TYPE_INPUT_INT).contains(itemPO.getType())) {
				itemPO.setContent(itemVO.getContent());
			}

			customerProfileItemDao.update(itemPO);

			List<CustomerProfileOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (CustomerProfileOptionVO optionVO : options) {

				if (optionVO == null) continue;

				CustomerProfileOptionPO optionPO = customerProfileOptionDao.get(optionVO.getCpoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				customerProfileOptionDao.update(optionPO);
			}
		}

		customerProfilePO.setStatus(SurveyPO.STATUS_HANDLE_INT);

		customerProfileDao.update(customerProfilePO);
	}

}
