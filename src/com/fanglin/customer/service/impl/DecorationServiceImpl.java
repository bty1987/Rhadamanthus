package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerNoticeDao;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.po.CustomerNoticePO;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.vo.DecorationVO;
import com.fanglin.data.common.dao.TalkingDao;
import com.fanglin.data.common.vo.TalkingVO;
import com.fanglin.data.po.TalkingPO;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.Paging;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.service.WeChatMessageService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("decorationServiceC")
@Transactional(readOnly = true)
public class DecorationServiceImpl implements DecorationService {

	private static final Logger log = LoggerFactory.getLogger(DecorationServiceImpl.class);

	@Autowired
	private DecorationDao cecorationDao;

	@Autowired
	private com.fanglin.decoration.dao.DecorationDao decorationDao;

	@Autowired
	private DecorationUserDao decorationUserDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private CustomerNoticeDao customerNoticeDao;

	@Autowired
	private WeChatMessageService messageService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private TalkingDao talkingDao;

	@Autowired
	private WeChatAppService weChatAppService;

	@Override
	public void queryCusDecorationUser(Paging paging, List<Filter> filters, DecorationVO decorationVO) {

		List<DecorationUserPO> decorationUserPOs = decorationUserDao.queryDecorationUser(paging, filters, decorationVO.getOrderId());

		List<DecorationUserVO> decorationUserVOs = new ArrayList<DecorationUserVO>();

		if (decorationUserPOs.size() != 0 && decorationUserPOs != null) {

			for (DecorationUserPO decorationUserPO : decorationUserPOs) {

				decorationUserVOs.add(decorationUserPO.ptv(new DecorationUserVO(new UserBaseVO(new DutyVO()))));
			}
		}

		paging.setData(decorationUserVOs);
	}

	@Override
	public Object queryCusDecoration(DecorationVO decorationVO, String unionId) {

		if (decorationVO == null) {

			List<DecorationPO> decorationPOs = cecorationDao.queryCusDecoration(unionId);
			List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

			for (DecorationPO decorationPO : decorationPOs) {

				decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

				com.fanglin.decoration.po.DecorationPO decorationDO = decorationDao.queryDecorationByOrderId(decorationPO.getOrderId());

				decorationPO.ptv(decorationVO, decorationDO);

				SystemConfigPO memberFlag = systemConfigDao.querySystemConfig("MEMBER_ENABLE_FLAG", decorationDO.getCompany());

				if (memberFlag != null && memberFlag.getValue() != null) decorationVO.setMemberFlag((short) 1);

				decorationVOs.add(decorationVO);
			}

			return decorationVOs;
		} else {

			DecorationPO decorationPO = cecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId);

			decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			if (decorationPO != null) {

				com.fanglin.decoration.po.DecorationPO decorationDO = decorationDao.queryDecorationByOrderId(decorationPO.getOrderId());

				decorationPO.ptv(decorationVO, decorationDao.queryDecorationByOrderId(decorationPO.getOrderId()));

				SystemConfigPO memberFlag = systemConfigDao.querySystemConfig("MEMBER_ENABLE_FLAG", decorationDO.getConpany());

				if (memberFlag != null && memberFlag.getValue() != null) decorationVO.setMemberFlag((short) 1);
			}

			return decorationVO;
		}
	}

	@Override
	public DecorationVO queryDecoration(DecorationVO decorationVO) {

		DecorationPO decorationPO = cecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), decorationVO.getUnionId());

		decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		if (decorationPO != null) {
			decorationPO.ptv(decorationVO, decorationDao.queryDecorationByOrderId(decorationPO.getOrderId()));
		}

		return decorationVO;
	}

	@Override
	public DecorationVO queryCusDecorationByOrderId(DecorationVO decorationVO) {

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		if (decorationPO != null) {

			BeanUtil.copyPropertie(decorationPO.getDesigner(), decorationVO.getDesigner(), Arrays.asList("dept", "duty"));
			BeanUtil.copyPropertie(decorationPO.getSalesman(), decorationVO.getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyPropertie(decorationPO.getSupervisor(), decorationVO.getSupervisor(), Arrays.asList("dept", "duty"));

			decorationVO.setType(decorationPO.getType());
			decorationVO.setTypeness(decorationPO.getTypeness());
			decorationVO.setSalesScale(decorationPO.getSaleScale());
			decorationVO.setCustomerId(decorationPO.getCustomer().getCid());
			decorationVO.setContractTime(decorationPO.getContractTime());
			decorationVO.setAddress(decorationPO.getHouse().getVillage().getName() + " " + SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()));
			decorationVO.setCreateTime(decorationPO.getCreateTime());
			decorationVO.setDepositTime(decorationPO.getDepositTime());
			decorationVO.setHouseArea(decorationPO.getHouse().getBuildArea());
			decorationVO.setMeasureTime(decorationPO.getMeasureTime());
			decorationVO.setOrderId(decorationPO.getOrderId());
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setFactPrice(decorationPO.getFactPrice());

		}

		return decorationVO;
	}

	@Override
	public DecorationVO queryCusDecorationForDefault(String unionId) throws FLException {

		DecorationPO decorationPO = cecorationDao.queryCusDecorationForDefault(unionId);

		DecorationVO decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		if (decorationPO != null) {
			decorationPO.ptv(decorationVO, decorationDao.queryDecorationByOrderId(decorationPO.getOrderId()));
		}

		return decorationVO;
	}

	@Override
	public String vodeCusDecoration(DecorationVO decorationVO) throws FLException {

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(330009, "无可绑定订单");
		}

		CustomerPO customerPO = decorationPO.getCustomer();

		if (customerPO == null) {
			throw new FLException(130002, "客户不存在");
		}

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		String url = String.format("%s/queryVode.do?phone=%s", isv.getValue(), decorationVO.getCustomerPhone() != null ? decorationVO.getCustomerPhone() : SensitiveDataHelper.decrypt(decorationPO.getCustomer().getPhone()));

		JSONObject json = HttpUtil.httpGet(url);

		if (json != null && json.getInteger("errorCode") != null && json.getInteger("errorCode") == 0) {
			return json.getString("securityCode");
		}

		if (json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0) {
			System.out.println(url);
			System.out.println(json);
		}

		return null;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int bindingCusDecoration(DecorationVO decorationVO, String unionId, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		log.info(String.format("Binding Decoration UnionId: %s, OrderId: %s.", unionId, decorationVO.getOrderId()));
		System.out.println(String.format("Binding Decoration UnionId: %s, OrderId: %s.", unionId, decorationVO.getOrderId()));

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330010, "绑定订单失败,验证码错误");
		}

		String phone = null;
		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);

		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			phone = weChatPhoneInfoVO.getPhoneNumber();
		}

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (decorationVO.getCustomerPhone() != null) {
			phone = decorationVO.getCustomerPhone();
		}

		List<CustomerPO> customerPOs = customerDao.queryCustomer(SensitiveDataHelper.getAllEncryptedForms(phone));

		if (customerPOs == null || customerPOs.isEmpty()) {
			throw new FLException(330009, "无可绑定订单");
		}

		CustomerPO customerPO = customerPOs.get(0);

		if (customerPO == null) {
			throw new FLException(330009, "无可绑定订单");
		}

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecoration(decorationVO.getOrderId(), SensitiveDataHelper.getAllEncryptedForms(phone));

		if (decorationPO == null) {
			throw new FLException(330009, "无可绑定订单");
		}

		if (cecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId) != null) {
			throw new FLException(330009, "订单已绑定");
		}

		DecorationPO cecorationPO = new DecorationPO();

		cecorationPO.setOrderId(decorationPO.getOrderId());
		cecorationPO.setAddress(decorationPO.getHouse().getVillage().getName() + " " + SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()));
		cecorationPO.setUnionId(unionId);
		cecorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_INIT_SHORT);

		cecorationDao.save(cecorationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCusDecorationForDefault(DecorationVO decorationVO, String unionId) throws FLException {

		DecorationPO decorationPO = cecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId);

		if (decorationPO == null) return 0;

		DecorationPO decorationDO = cecorationDao.queryCusDecorationForDefault(unionId);

		if (decorationDO != null) {

			decorationDO.setDefaultFlag(DecorationPO.DEFAULTFLAG_INIT_SHORT);
			decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_DEFAULT_SHORT);

			cecorationDao.update(decorationDO);
			cecorationDao.update(decorationPO);
		} else {

			decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_DEFAULT_SHORT);

			cecorationDao.update(decorationPO);
		}

		return 0;
	}

	@Override
	public int sendMessage(String orderId, String name, String content) {

		sendMessage(orderId, name, content, null, null);

		return 0;
	}

	@Override
	public int sendMessage(String orderId, String name, String content, String path) {

		sendMessage(orderId, name, content, path, null);

		return 0;
	}

	@Override
	public int sendMessage(String orderId, String name, String content, String path, UserPO creater) {

		List<DecorationPO> decorationPOs = cecorationDao.queryCusDecorationByOrderId(orderId);

		for (DecorationPO decorationPO : decorationPOs) {
			messageService.sendServiceSchedule(decorationPO.getUnionId(), name, orderId, content, path);
		}

		customerNoticeDao.save(new CustomerNoticePO().init(orderId, name, content, path, creater));

		return 0;
	}

	@Override
	public int sendMessage(String key, String orderId, String name, String content, String path, UserPO creater) {

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) return 0;

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(key, decorationPO.getCompany());

		if (systemConfigPO != null && !"SEND".equals(systemConfigPO.getValue())) return 0;

		sendMessage(orderId, name, content, path, creater);

		return 0;
	}

	@Override
	public List<TalkingVO> queryTalking(DecorationVO decorationVO, TalkingVO talkingVO) {

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		List<TalkingPO> talkingPOs = talkingDao.queryTalking(Arrays.asList(talkingVO.getType()), decorationPO.getCompany());
		List<TalkingVO> talkingVOs = new ArrayList<TalkingVO>();

		for (TalkingPO talKingPO : talkingPOs) {

			talkingVO = new TalkingVO();

			BeanUtil.copyProperties(talKingPO, talkingVO);

			talkingVOs.add(talkingVO);
		}

		return talkingVOs;
	}

}
