package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.vo.DecorationVO;
import com.fanglin.data.common.dao.TalkingDao;
import com.fanglin.data.common.vo.TalkingVO;
import com.fanglin.data.po.TalkingPO;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("decorationServiceC")
@Transactional(readOnly = true)
public class DecorationServiceImpl implements DecorationService {

	@Autowired
	private DecorationDao cusDecorationDao;

	@Autowired
	private com.fanglin.decoration.dao.DecorationDao decorationDao;

	@Autowired
	private DecorationUserDao decorationUserDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private TalkingDao talkingDao;

	@Override
	public void queryCusDecorationUser(Paging paging, List<Filter> filters, DecorationVO decorationVO) {

		List<DecorationUserPO> decorationUserPOs = decorationUserDao.queryDecorationUser(paging, filters, decorationVO.getOrderId());

		List<DecorationUserVO> decorationUserVOs = new ArrayList<DecorationUserVO>();

		if (decorationUserPOs.size() != 0 && decorationUserPOs != null) {

			for (DecorationUserPO decorationUserPO : decorationUserPOs) {

				DecorationUserVO decorationUserVO = new DecorationUserVO(new UserBaseVO(new DutyVO()));

				BeanUtil.copyPropertie(decorationUserPO, decorationUserVO, Arrays.asList("user"));
				BeanUtil.copyPropertie(decorationUserPO.getUser(), decorationUserVO.getUser(), Arrays.asList("dept", "duty"));
				BeanUtil.copyPropertie(decorationUserPO.getUser().getDuty(), decorationUserVO.getUser().getDuty(), Arrays.asList("departmentType"));

				decorationUserVOs.add(decorationUserVO);
			}
		}

		paging.setData(decorationUserVOs);
	}

	@Override
	public Object queryCusDecoration(DecorationVO decorationVO, String unionId) {

		if (decorationVO == null) {

			List<DecorationPO> decorationPOs = cusDecorationDao.queryCusDecoration(unionId);
			List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

			for (DecorationPO decorationPO : decorationPOs) {

				decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

				decorationPO.ptv(decorationVO, decorationDao.queryDecorationByOrderId(decorationPO.getOrderId()));

				decorationVOs.add(decorationVO);
			}

			return decorationVOs;
		} else {

			DecorationPO decorationPO = cusDecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId);

			decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			if (decorationPO != null) {
				decorationPO.ptv(decorationVO, decorationDao.queryDecorationByOrderId(decorationPO.getOrderId()));
			}

			return decorationVO;
		}
	}

	@Override
	public DecorationVO queryDecoration(DecorationVO decorationVO) {

		DecorationPO decorationPO = cusDecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), decorationVO.getUnionId());

		decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		if (decorationPO != null) {
			decorationPO.ptv(decorationVO, decorationDao.queryDecorationByOrderId(decorationPO.getOrderId()));
		}

		return decorationVO;
	}

	@Override
	public DecorationVO queryCusDecorationByOrderId(DecorationVO decorationVO) {

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		if (decorationPO != null) {

			BeanUtil.copyPropertie(decorationPO.getDesigner(), decorationVO.getDesigner(), Arrays.asList("dept", "duty"));
			BeanUtil.copyPropertie(decorationPO.getSalesman(), decorationVO.getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyPropertie(decorationPO.getSupervisor(), decorationVO.getSupervisor(), Arrays.asList("dept", "duty"));

			decorationVO.setType(decorationPO.getType());
			decorationVO.setTypeness(decorationPO.getTypeness());
			decorationVO.setSalesScale(decorationPO.getSaleScale());
			decorationVO.setCustomerId(decorationPO.getCustomer().getCid());
			decorationVO.setContractTime(decorationPO.getContractTime());
			decorationVO.setAddress(decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber());
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

		DecorationPO decorationPO = cusDecorationDao.queryCusDecorationForDefault(unionId);

		DecorationVO decorationVO = new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

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

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		String url = String.format("%s/queryVode.do?phone=%s", isv.getValue(), decorationPO.getCustomer().getPhone());

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
	public int bindingCusDecoration(DecorationVO decorationVO, String unionId, String securityCode, String verifyCode) throws FLException {

		try {
			if (!verifyCode.equals(AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")))) {
				throw new FLException(330010, "绑定订单失败,验证码错误");
			}
		} catch (Exception e) {
			throw new FLException(330010, "绑定订单失败,验证码错误");
		}

		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByPhone(decorationVO.getCustomerPhone(), CustomerPhonePO.STATUS_ENABLE_INT, 0);

		if (customerPhonePOs == null || customerPhonePOs.size() == 0) {
			throw new FLException(330009, "无可绑定订单");
		}

		CustomerPO customerPO = customerDao.get(customerPhonePOs.get(0).getCid());

		if (customerPO == null) {
			throw new FLException(330009, "无可绑定订单");
		}

		List<com.fanglin.decoration.po.DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerId(customerPO.getCid());

		if (decorationPOs.size() == 0 || decorationPOs == null) {
			throw new FLException(330009, "无可绑定订单");
		}

		DecorationPO _decoration = cusDecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId);

		if (_decoration != null) return 0;

		for (com.fanglin.decoration.po.DecorationPO decorationPO : decorationPOs) {

			if (decorationVO.getOrderId().equals(decorationPO.getOrderId())) {

				DecorationPO _decorationPO = new DecorationPO();

				_decorationPO.setOrderId(decorationPO.getOrderId());
				_decorationPO.setAddress(decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber());
				_decorationPO.setUnionId(unionId);
				_decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_INIT_SHORT);

				cusDecorationDao.save(_decorationPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCusDecorationForDefault(DecorationVO decorationVO, String unionId) throws FLException {

		DecorationPO decorationPO = cusDecorationDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId);

		if (decorationPO != null) {

			DecorationPO _decorationPO = cusDecorationDao.queryCusDecorationForDefault(unionId);

			if (_decorationPO != null) {

				_decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_INIT_SHORT);
				decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_DEFAULT_SHORT);

				cusDecorationDao.update(_decorationPO);
				cusDecorationDao.update(decorationPO);
			} else {

				decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_DEFAULT_SHORT);

				cusDecorationDao.update(decorationPO);
			}
		}

		return 0;
	}

	@Override
	public int sendMessage(String orderId, String name, String content) {

		sendMessage(orderId, name, content, null);

		return 0;
	}

	@Override
	public int sendMessage(String orderId, String name, String content, String path) {

		List<DecorationPO> decorationPOs = cusDecorationDao.queryCusDecorationByOrderId(orderId);

		for (DecorationPO decorationPO : decorationPOs) {
			messageService.sendMessage(decorationPO.getUnionId(), name, orderId, content, path);
		}

		return 0;
	}

	@Override
	public int sendMessage(String key, String orderId, String name, String content, String path) {

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) return 0;

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(key, decorationPO.getCompany());

		if (systemConfigPO != null && !"SEND".equals(systemConfigPO.getValue())) return 0;

		sendMessage(orderId, name, content, path);

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
