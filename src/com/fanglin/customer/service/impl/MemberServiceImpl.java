package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.dao.CppointPaymentDao;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.dao.MemberDao;
import com.fanglin.customer.po.CppointPO;
import com.fanglin.customer.po.CppointPaymentPO;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.customer.service.MemberService;
import com.fanglin.customer.vo.BasePaymentVO;
import com.fanglin.customer.vo.MemberActivityVO;
import com.fanglin.customer.vo.MemberGoodsVO;
import com.fanglin.customer.vo.MemberOrderItemVO;
import com.fanglin.customer.vo.MemberOrderVO;
import com.fanglin.customer.vo.MemberPointVO;
import com.fanglin.customer.vo.MemberVO;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;

import edu.emory.mathcs.backport.java.util.Collections;

@Service("memberservice")
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

	@Autowired
	private MemberDao memberDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	// @Autowired
	// private SalesDao salesDao;

	// @Autowired
	// private SalesPaymentDao salesPaymentDao;

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private CppointDao cppointDao;

	@Autowired
	private CppointRecordDao cppointRecordDao;

	@Autowired
	private CppointPaymentDao cppointPaymentDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public Map<String, List<MemberVO>> queryMember(List<MemberVO> members) throws FLException {

		if (null == members || members.isEmpty()) {
			throw new FLException(130021, "客户电话不存在");
		}

		members = members.subList(0, Math.min(10, members.size()));

		Map<String, List<MemberVO>> resultMap = new HashMap<String, List<MemberVO>>();
		Map<String, List<Long>> phoneToCustomerMap = new HashMap<String, List<Long>>();

		List<Integer> companyIds = new ArrayList<Integer>();
		List<Long> customerIds = new ArrayList<Long>();

		List<String> phoneList = new ArrayList<String>();

		for (MemberVO member : members) {
			if (member.getPhone() != null) {
				phoneList.add(FormatUtil.encodePhone(member.getPhone()));
				resultMap.put(member.getPhone(), new ArrayList<MemberVO>());
			} else {
				throw new FLException(130021, "客户电话不存在");
			}
		}

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhone(phoneList, CustomerPhonePO.STATUS_ENABLE_INT, null, null);

		if (customerPhones == null || customerPhones.size() == 0) {
			throw new FLException(130006, "客户电话不存在");
		}

		for (CustomerPhonePO customerPhone : customerPhones) {
			List<Long> customerIdList = phoneToCustomerMap.get(customerPhone.getPhone());
			if (customerIdList == null) {
				customerIdList = new ArrayList<Long>();
				phoneToCustomerMap.put(customerPhone.getPhone(), customerIdList);
			}
			customerIdList.add(customerPhone.getCid());
		}

		for (CustomerPhonePO customerPhone : customerPhones) {
			customerIds.add(customerPhone.getCid());
		}

		if (customerIds == null || customerIds.size() == 0) {
			throw new FLException(130006, "客户电话不存在");
		}

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);

		if (decorationPOs == null || decorationPOs.size() == 0) {
			throw new FLException(130006, "客户装修信息不存在");
		}

		Map<Long, List<DecorationPO>> customerToDecorationMap = new HashMap<Long, List<DecorationPO>>();

		for (DecorationPO decorationPO : decorationPOs) {

			companyIds.add(decorationPO.getCompany());

			Long customerId = decorationPO.getCustomer().getCid();
			List<DecorationPO> decorationList = customerToDecorationMap.get(customerId);

			if (decorationList == null) {
				decorationList = new ArrayList<DecorationPO>();
				customerToDecorationMap.put(customerId, decorationList);
			}

			decorationList.add(decorationPO);
		}

		if (companyIds == null || companyIds.size() == 0) {
			throw new FLException(130006, "客户公司不存在");
		}

		Map<Integer, String> companyMap = new HashMap<Integer, String>();

		List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(companyIds);

		for (CompanyPO companyPO : companyPOs) {
			companyMap.put(companyPO.getCid(), companyPO.getName());
		}

		for (MemberVO member : members) {
			String originalPhone = member.getPhone();
			String encodedPhone = FormatUtil.encodePhone(originalPhone);

			List<Long> customerIdList = phoneToCustomerMap.get(encodedPhone);
			if (customerIdList == null) {
				continue;
			}

			List<MemberVO> memberList = resultMap.get(originalPhone);

			for (Long customerId : customerIdList) {
				List<DecorationPO> decorations = customerToDecorationMap.get(customerId);
				if (decorations == null) {
					continue;
				}

				for (DecorationPO decorationPO : decorations) {
					String companyName = companyMap.get(decorationPO.getCompany());
					MemberVO resultMember = new MemberVO().init(decorationPO, companyName);

					resultMember.setPhone(originalPhone);
					memberList.add(resultMember);
				}
			}
		}

		return resultMap;
	}

	@Override
	public List<MemberPointVO> queryMemberPoint(List<MemberPointVO> memberPointVOs) {

		List<MemberPointVO> memberPointFOs = memberPointVOs.subList(0, Math.min(10, memberPointVOs.size()));

		for (MemberPointVO memberPointVO : memberPointFOs) {

			String orderId = memberPointVO.getOrderId();

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

			if (decorationPO == null) continue;

			long amount = Math.abs(cppointDao.amountCppoint(orderId));

			long dpoint = 0l;
			long spoint = 0l;
			long point = 0l;

			dpoint = memberDao.amountMemberPointForDecoration(orderId);
			spoint = memberDao.amountMemberPointForMaterial(orderId);

			long subDecorationPoint = Arith.sub(dpoint, amount);
			long subMaterialPoint = Arith.sub(spoint, 0);
			memberPointVO.setDecorationPoint(Arith.mul(subDecorationPoint, 1l));
			memberPointVO.setMaterialPoint(Arith.mul(subMaterialPoint, 1l));

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

			memberPointVO.setFreezeDecorationPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getBalance() : 0, Arith.sub(memberDao.totalMemberPointForDecoration(orderId), dpoint)), 1l));
			memberPointVO.setFreezeMaterialPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0, Arith.sub(memberDao.totalMemberPointForMaterial(orderId), spoint)), 1l));

			point = Arith.add(memberPointVO.getDecorationPoint(), memberPointVO.getMaterialPoint());

			memberPointVO.setOperatePoint(point);
		}

		return memberPointVOs;
	}

	@Override
	public Map<String, List<MemberVO>> queryMemberForInfo(List<MemberVO> members, Integer company) throws FLException {

		if (null == members || members.isEmpty()) {
			throw new FLException(130021, "客户电话不存在");
		}

		Map<String, List<MemberVO>> resultMap = new HashMap<String, List<MemberVO>>();

		members = members.subList(0, Math.min(10, members.size()));

		List<String> phoneList = new ArrayList<String>();

		List<Long> customerIds = new ArrayList<Long>();

		for (MemberVO member : members) {
			if (member.getPhone() != null) {

				phoneList.add(FormatUtil.encodePhone(member.getPhone()));
				resultMap.put(member.getPhone(), new ArrayList<MemberVO>());
			} else {
				throw new FLException(130021, "客户电话不存在");
			}
		}

		List<CustomerPhonePO> customerPhoneList = customerPhoneDao.queryCustomerPhone(phoneList, null, null, company);

		if (customerPhoneList == null || customerPhoneList.isEmpty()) {
			throw new FLException(130021, "客户电话不存在");
		}

		Map<String, List<Long>> phoneToCustomerMap = new HashMap<String, List<Long>>();

		for (CustomerPhonePO customerPhone : customerPhoneList) {
			String encodedPhone = customerPhone.getPhone();
			String originalPhone = FormatUtil.decodePhone(encodedPhone);

			if (resultMap.containsKey(originalPhone)) {
				List<Long> customerIdList = phoneToCustomerMap.get(originalPhone);
				if (customerIdList == null) {
					customerIdList = new ArrayList<Long>();
					phoneToCustomerMap.put(originalPhone, customerIdList);
				}
				customerIdList.add(customerPhone.getCid());
				customerIds.add(customerPhone.getCid());
			}
		}

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);
		List<DecorationPO> decorationAOs = new ArrayList<DecorationPO>();

		Map<String, String> decorationToPhoneMap = new HashMap<String, String>();

		for (DecorationPO decorationPO : decorationPOs) {

			for (Map.Entry<String, List<Long>> entry : phoneToCustomerMap.entrySet()) {
				if (entry.getValue().contains(decorationPO.getCustomer().getCid())) {
					decorationToPhoneMap.put(decorationPO.getOrderId(), entry.getKey());
					break;
				}
			}

			List<DecorationPO> chanceRefer = decorationInfoDao.queryDecorationForChanceRefer(decorationPO.getOrderId());
			if (chanceRefer != null) {
				for (DecorationPO refer : chanceRefer) {
					decorationAOs.add(refer);
					decorationToPhoneMap.put(refer.getOrderId(), decorationToPhoneMap.get(decorationPO.getOrderId()));
				}
			}

			List<DecorationPO> originRefer = decorationInfoDao.queryDecorationForOriginRefer(decorationPO.getOrderId());
			if (originRefer != null) {
				for (DecorationPO refer : originRefer) {
					decorationAOs.add(refer);
					decorationToPhoneMap.put(refer.getOrderId(), decorationToPhoneMap.get(decorationPO.getOrderId()));
				}
			}

			List<DecorationPO> orderRefer = decorationInfoDao.queryDecorationForOrderReferd(decorationPO.getOrderId());
			if (orderRefer != null) {
				for (DecorationPO refer : orderRefer) {
					decorationAOs.add(refer);
					decorationToPhoneMap.put(refer.getOrderId(), decorationToPhoneMap.get(decorationPO.getOrderId()));
				}
			}
		}

		for (DecorationPO decorationPO : decorationAOs) {

			MemberVO member = new MemberVO();

			String recommenderPhone = decorationToPhoneMap.get(decorationPO.getOrderId());
			if (recommenderPhone == null) {
				continue;
			}

			List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByCid(decorationPO.getCustomer().getCid(), CustomerPhonePO.STATUS_ENABLE_INT);

			if (!customerPhones.isEmpty()) {
				member.setPhone(FormatUtil.decodePhone(customerPhones.get(0).getPhone()));
			}

			member.setStoreTime(decorationPO.getCreateTime());
			member.setOrderId(decorationPO.getOrderId());

			if (decorationPO.getPrecontractTime() != null) member.setContractTime(decorationPO.getPrecontractTime());
			if (decorationPO.getContractTime() != null) member.setContractTime(decorationPO.getContractTime());

			member.setStatus(decorationPO.getStatus());

			List<MemberVO> memberList = resultMap.get(recommenderPhone);
			if (memberList != null) {
				memberList.add(member);
			}
		}

		return resultMap;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMemberActivity(MemberActivityVO memberActivityVO, List<String> companys, String userId) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		if (companys == null) companys = Arrays.asList(CompanyServiceImpl.encode(CompanyPO.TYPE_HEADQUARTER_INT));

		for (String company : companys) {

			ActivityPO activityPO = null;

			short decotype = 0;
			short saletype = 0;

			if (memberActivityVO.getType() == 0) {
				decotype = 1;
			}

			if (memberActivityVO.getType() == 1) {
				saletype = 1;
			}

			if (memberActivityVO.getType() == 2) {
				decotype = 1;
				saletype = 1;
			}

			if (decotype == 1) {

				activityPO = new ActivityPO();

				BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

				activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				activityPO.setCreater(creater);

				activityPO.setCompany(CompanyServiceImpl.decode(company));
				activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);

				activityPO.setDefaults(ActivityPO.TYPE_DECORATION_INT);
				activityPO.setMultiple(memberActivityVO.getMultiple());
				activityPO.setAtttype(ActivityPO.ATTTYPE_ONLINE_INT);

				activityDao.save(activityPO);
			}

			if (saletype == 1) {

				activityPO = new ActivityPO();

				BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

				activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				activityPO.setCreater(creater);
				activityPO.setCompany(CompanyServiceImpl.decode(company));

				activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);

				activityPO.setDefaults(ActivityPO.TYPE_SALES_INT);
				activityPO.setMultiple(memberActivityVO.getMultiple());
				activityPO.setAtttype(ActivityPO.ATTTYPE_ONLINE_INT);

				activityDao.save(activityPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeMemberOrder(MemberOrderVO memberOrderVO, List<MemberOrderItemVO> memberOrderItemVOs, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		long amount = Math.abs(cppointDao.amountCppoint(orderId));

		long totald = memberDao.amountMemberPointForDecoration(orderId);
		long totals = memberDao.amountMemberPointForMaterial(orderId);
		long totalo = Arith.mul(memberOrderVO.getSurplusPoint(), 1000000l);

		if (Arith.add(Arith.sub(totald, amount), Arith.sub(totals, 0)) < Arith.mul(memberOrderVO.getPoint(), 1000000l)) {
			throw new FLException(330049, "积分不足");
		}

		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(orderId);

		DecorationActivityPO decorationActivityPO = decorationActivityPOs != null && decorationActivityPOs.size() != 0 ? decorationActivityPOs.get(0) : null;

		if (decorationActivityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		for (MemberOrderItemVO memberOrderItemVO : memberOrderItemVOs) {

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

			AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberOrderItemVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

			decorationActivityItemPO.setOrderId(orderId);

			decorationActivityItemPO.setAid(decorationActivityPO.getActivity().getAid());
			decorationActivityItemPO.setActivityName(decorationActivityPO.getActivity().getName());

			if (awardStockPO != null) decorationActivityItemPO.setAsid(awardStockPO.getAsId());

			decorationActivityItemPO.setActivityItemName(memberOrderItemVO.getName());
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_DELIVERY_INT);

			decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
			decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);

			decorationActivityItemPO.setNo(memberOrderVO.getPointOrderId());
			decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_ONLINE_INT);
			decorationActivityItemPO.setNum((int) Arith.mul(memberOrderItemVO.getNum(), 1000000l));
			decorationActivityItemPO.setMoney((int) Arith.mul(memberOrderItemVO.getPoint(), 1000000l));
			decorationActivityItemPO.setCreater(creater);
			decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationActivityItemDao.save(decorationActivityItemPO);
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {

			cppointPO = new CppointPO();

			cppointPO.setCustomer(decorationPO.getCustomer());
			cppointPO.setOrderId(orderId);
			cppointPO.setCompany(decorationPO.getCompany());
		}

		cppointPO.setDpoint(Arith.sub(totald, amount));
		cppointPO.setSpoint(Arith.sub(totals, 0));
		cppointPO.setOpoint(totalo);

		cppointPO.setPoint(Arith.sub(Arith.add(cppointPO.getDpoint(), cppointPO.getSpoint()), Arith.mul(memberOrderVO.getPoint(), 1000000l)));
		cppointDao.saveOrUpdate(cppointPO);

		addCppointPayment(memberOrderVO, cppointPO, decorationActivityPO.getActivity().getMultiple());

		List<CppointPaymentPO> cppointPayments = cppointPaymentDao.queryCppointPaymentByOrderId(memberOrderVO.getOrderId());

		if (cppointPayments == null) {
			throw new FLException(140013, "积分不存在");
		}

		long dpoints = 0;

		long spoints = 0;

		for (CppointPaymentPO payment : cppointPayments) {

			if (CppointPaymentPO.TYPE_DECORATION_INT == payment.getType()) {
				dpoints += payment.getPoint();
			}
			if (CppointPaymentPO.TYPE_MATERIAL_INT == payment.getType()) {
				spoints += payment.getPoint();
			}
		}
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getPoint(), dpoints, spoints, cppointPO.getOpoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), dpoints, spoints, cppointPO.getOpoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelMemberOrder(MemberOrderVO memberOrderVO, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItem(orderId, memberOrderVO.getPointOrderId());

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

			decorationActivityItemDao.update(decorationActivityItemPO);
		}

		decorationActivityItemDao.flush();

		long totalo = Arith.mul(memberOrderVO.getSurplusPoint(), 1000000l);

		cppointPO.setOpoint(totalo);

		cppointPO.setPoint(Arith.add(cppointPO.getPoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l)));

		cppointDao.saveOrUpdate(cppointPO);

		cancelCppointPayment(memberOrderVO);

		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getPoint(), cppointPO.getDpoint(), cppointPO.getSpoint(), cppointPO.getOpoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), cppointPO.getDpoint(), cppointPO.getSpoint(), cppointPO.getOpoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMemberGoods(MemberGoodsVO memberGoodsVO) {

		AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberGoodsVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

		if (awardStockPO == null) {

			awardStockPO = new AwardStockPO();

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);
			awardStockPO.setCompany(CompanyPO.TYPE_HEADQUARTER_INT);
			awardStockPO.setFormat(memberGoodsVO.getCategory());

			awardStockDao.save(awardStockPO);
		} else {

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);

			awardStockDao.update(awardStockPO);
		}

		return 0;
	}

	private void addCppointPayment(MemberOrderVO memberOrderVO, CppointPO cppointPO, int multiple) throws FLException {

		long totalPoints = Arith.mul(memberOrderVO.getPoint(), multiple);

		CppointRecordPO cppointRecord = cppointRecordDao.queryCppointRecordByOrderId(memberOrderVO.getOrderId());

		List<CppointPaymentPO> cppointPayments = cppointPaymentDao.queryCppointPaymentByOrderId(memberOrderVO.getOrderId());

		List<BasePaymentVO> allPayments = getAllPaymentsByOrderId(memberOrderVO.getOrderId());

		if (allPayments == null || allPayments.isEmpty()) {
			throw new FLException(130006, "客户支付记录不存在");
		}

		Map<Long, Long> paymentUsedMap = new HashMap<Long, Long>();

		Map<Long, Long> paymentAvailableMap = new HashMap<Long, Long>();

		for (BasePaymentVO basePayment : allPayments) {
			paymentAvailableMap.put(basePayment.getPaymentId(), Arith.mul(basePayment.getReferMoney(), 1l));
		}

		if (cppointPayments != null) {

			for (CppointPaymentPO cppointPayment : cppointPayments) {

				Long paymentId = cppointPayment.getPid();

				long usedPoints = cppointPayment.getPoint();
				Long currentUsed = paymentUsedMap.get(paymentId);

				if (currentUsed == null) {

					paymentUsedMap.put(paymentId, usedPoints);
				} else {
					paymentUsedMap.put(paymentId, currentUsed + usedPoints);
				}

				Long currentAvailable = paymentAvailableMap.get(paymentId);
				if (currentAvailable != null) {

					paymentAvailableMap.put(paymentId, currentAvailable - usedPoints);

				}
			}
		}

		List<CppointPaymentPO> newRecords = new ArrayList<CppointPaymentPO>();

		for (BasePaymentVO basePayment : allPayments) {

			if (totalPoints <= 0) {
				break;
			}

			Long decorationPaymentId = basePayment.getPaymentId();
			Long availablePoints = paymentAvailableMap.get(decorationPaymentId);// 这笔支付当前可用的积分余额

			if (availablePoints <= 0) {
				continue;
			}

			long point = Math.min(availablePoints, totalPoints);

			if (point > 0) {

				CppointPaymentPO cppointPayment = new CppointPaymentPO();
				cppointPayment.setCpid(cppointPO.getCpid());
				cppointPayment.setCppointRecord(cppointRecord);
				cppointPayment.setNo(memberOrderVO.getPointOrderId());
				cppointPayment.setOrderId(memberOrderVO.getOrderId());
				cppointPayment.setPid(basePayment.getPaymentId());
				cppointPayment.setType(basePayment.getPaymentType());
				cppointPayment.setPoint(point);
				cppointPayment.setStatus(CppointPaymentPO.STATUS_ABLE_SHORT);
				cppointPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				newRecords.add(cppointPayment);

				totalPoints -= point;
				paymentAvailableMap.put(decorationPaymentId, availablePoints - point);
			}
		}

		for (CppointPaymentPO record : newRecords) {
			cppointPaymentDao.save(record);
		}

	}

	private void cancelCppointPayment(MemberOrderVO memberOrderVO) throws FLException {

		cppointRecordDao.updateCppointRecordByNo(memberOrderVO.getPointOrderId());

		cppointPaymentDao.updateCppointPaymentByNo(memberOrderVO.getPointOrderId());

	}

	/**
	 * 获取所有支付记录并按创建时间排序
	 */
	private List<BasePaymentVO> getAllPaymentsByOrderId(String orderId) throws FLException {
		List<BasePaymentVO> allPayments = new ArrayList<BasePaymentVO>();

		// 查询装修支付记录
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT, DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT };

		// 查询装修支付记录
		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderId(orderId, paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		if (decorationPayments != null) {
			for (DecorationPaymentPO dp : decorationPayments) {
				allPayments.add(new BasePaymentVO(dp.getDpid(), dp.getReferMoney(), dp.getCreateTime(), CppointPaymentPO.TYPE_DECORATION_INT));
			}
		}

		/*
		 * List<Long> salesIds = new ArrayList<Long>(); List<Short> deposiTtypes = Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT, SalesPaymentPO.TYPE_REPLENISHMENT_INT, SalesPaymentPO.STATUS_PAIDFOR_INT);
		 * 
		 * List<SalesPO> salesList = salesDao.querySalesByOrderId(orderId); for(SalesPO sales : salesList){ salesIds.add(sales.getSid()); } // 查询主材支付记录 List<SalesPaymentPO> salesPayments = salesPaymentDao.querySalesPaymentBySids(salesIds, deposiTtypes); if (salesPayments != null) { for (SalesPaymentPO salesPayment : salesPayments) { allPayments.add(new BasePaymentVO(salesPayment.getSpid(), salesPayment.getReferMoney(), salesPayment.getCreateTime(), CppointPaymentPO.TYPE_MATERIAL_INT)); } }
		 */

		// 按创建时间排序
		Collections.sort(allPayments, new Comparator<BasePaymentVO>() {
			@Override
			public int compare(BasePaymentVO o1, BasePaymentVO o2) {
				return o1.getCreateTime().compareTo(o2.getCreateTime());
			}
		});

		return allPayments;
	}
}
