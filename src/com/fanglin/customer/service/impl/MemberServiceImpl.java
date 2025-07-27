package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.MemberDao;
import com.fanglin.customer.po.CppointPO;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.service.MemberService;
import com.fanglin.customer.vo.MemberActivityVO;
import com.fanglin.customer.vo.MemberGoodsVO;
import com.fanglin.customer.vo.MemberOrderItemVO;
import com.fanglin.customer.vo.MemberOrderVO;
import com.fanglin.customer.vo.MemberPointVO;
import com.fanglin.customer.vo.MemberVO;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

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
	private CustomerChanceDao customerChanceDao;

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

	@Override
	public List<MemberVO> queryMember(MemberVO memberVO) throws FLException {

		List<MemberVO> memberVOs = new ArrayList<MemberVO>();

		if (memberVO.getPhone() == null) {
			return memberVOs;
		}

		Paging paging = new Paging(0, 10);
		List<Filter> filters = new ArrayList<Filter>();

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByPhone(memberVO.getPhone(), CustomerPhonePO.STATUS_ENABLE_INT, null);

		filters.add(new Filter("decoration.customer.cid", (null != customerPhones && !customerPhones.isEmpty()) ? String.valueOf(customerPhones.get(0).getCid()) : "-1", "eq"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForCompany(paging, filters, null);

		for (DecorationPO decorationPO : decorationPOs) {
			memberVOs.add(new MemberVO().init(decorationPO));
		}

		return memberVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<MemberPointVO> queryMemberPoint(List<MemberPointVO> memberPointVOs) {

		List<MemberPointVO> memberPointFOs = memberPointVOs.subList(0, Math.min(10, memberPointVOs.size()));

		for (MemberPointVO memberPointVO : memberPointFOs) {

			String orderId = memberPointVO.getOrderId();

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

			if (decorationPO == null) continue;

			CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

			if (cppointPO == null) {

				cppointPO = new CppointPO();

				cppointPO.getCustomer().setCid(decorationPO.getCustomer().getCid());
				cppointPO.setOrderId(orderId);
				cppointPO.setCompany(decorationPO.getCompany());

				cppointPO.setDpoint(memberDao.amountMemberPointForDecoration(orderId));
				cppointPO.setSpoint(memberDao.amountMemberPointForMaterial(orderId));

				cppointPO.setPoint(Arith.add(cppointPO.getDpoint(), cppointPO.getSpoint()));

				cppointDao.saveOrUpdate(cppointPO);
			}

			memberPointVO.setDecorationPoint(cppointPO.getDpoint());
			memberPointVO.setMaterialPoint(cppointPO.getSpoint());

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

			memberPointVO.setFreezeDecorationPoint(Arith.add(advancePaymentPO != null ? advancePaymentPO.getBalance() : 0, Arith.sub(memberDao.totalMemberPointForDecoration(orderId), memberPointVO.getDecorationPoint())));
			memberPointVO.setFreezeMaterialPoint(Arith.add(advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0, Arith.sub(memberDao.totalMemberPointForMaterial(orderId), memberPointVO.getMaterialPoint())));

			memberPointVO.setOperatePoint(Arith.add(memberPointVO.getDecorationPoint(), memberPointVO.getMaterialPoint()));
		}

		return memberPointVOs;
	}

	@Override
	public List<MemberVO> queryMemberForInfo(List<MemberVO> memberVOs, Integer company) {

		List<MemberVO> memberROs = new ArrayList<MemberVO>();
		List<MemberVO> memberFOs = memberVOs.subList(0, Math.min(10, memberVOs.size()));

		for (MemberVO memberVO : memberFOs) {

			CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhoneForDefault(memberVO.getPhone(), company);

			if (customerPhonePO == null) continue;

			List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerId(customerPhonePO.getCid());

			for (DecorationPO decorationPO : decorationPOs) {

				MemberVO member = new MemberVO();

				CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(decorationPO.getOrderId());

				if (customerChancePO != null) member.setStoreTime(customerChancePO.getMeetTime());

				member.setContractTime(decorationPO.getContractTime());
				member.setPhone(memberVO.getPhone());

				memberROs.add(member);
			}
		}

		return memberROs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMemberActivity(MemberActivityVO memberActivityVO, String userId) {

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

		UserPO creater = userDao.queryUserByUserId(userId);

		if (decotype == 1) {

			activityPO = new ActivityPO();

			BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

			activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			activityPO.setCreater(creater);
			activityPO.setCompany(CompanyPO.TYPE_HEADQUARTER_INT);

			activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);

			activityPO.setDefaults(ActivityPO.TYPE_DECORATION_INT);
			activityPO.setMultiple(memberActivityVO.getMultiple());

			activityDao.save(activityPO);
		}

		if (saletype == 1) {

			activityPO = new ActivityPO();

			BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

			activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			activityPO.setCreater(creater);
			activityPO.setCompany(CompanyPO.TYPE_HEADQUARTER_INT);

			activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);

			activityPO.setDefaults(ActivityPO.TYPE_SALES_INT);
			activityPO.setMultiple(memberActivityVO.getMultiple());

			activityDao.save(activityPO);
		}

		activityDao.save(activityPO);

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

		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(orderId);

		UserPO creater = userDao.queryUserByUserId(userId);

		for (MemberOrderItemVO memberOrderItemVO : memberOrderItemVOs) {

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

			AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberOrderItemVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

			decorationActivityItemPO.setOrderId(orderId);

			decorationActivityItemPO.setAid(decorationActivityPOs != null && decorationActivityPOs.size() != 0 ? decorationActivityPOs.get(0).getActivity().getAid() : 0);
			decorationActivityItemPO.setActivityName(decorationActivityPOs != null && decorationActivityPOs.size() != 0 ? decorationActivityPOs.get(0).getActivity().getName() : "");

			if (awardStockPO != null) decorationActivityItemPO.setAsid(awardStockPO.getAsId());

			decorationActivityItemPO.setActivityItemName(memberOrderItemVO.getName());
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);

			decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
			decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);

			decorationActivityItemPO.setNum(memberOrderItemVO.getNum());
			decorationActivityItemPO.setNo(memberOrderVO.getPointOrderId());
			decorationActivityItemPO.setCreater(creater);
			decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationActivityItemDao.save(decorationActivityItemPO);
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {

			cppointPO = new CppointPO();

			cppointPO.getCustomer().setCid(decorationPO.getCustomer().getCid());
			cppointPO.setOrderId(orderId);
			cppointPO.setCompany(decorationPO.getCompany());

			cppointPO.setDpoint(memberDao.amountMemberPointForDecoration(orderId));
			cppointPO.setSpoint(memberDao.amountMemberPointForMaterial(orderId));
		}

		cppointPO.setDpoint(Arith.sub(cppointPO.getDpoint(), memberOrderVO.getPoint()));
		cppointPO.setOpoint(memberOrderVO.getSurplusPoint());
		cppointPO.setPoint(Arith.sub(cppointPO.getPoint(), memberOrderVO.getPoint()));

		cppointDao.saveOrUpdate(cppointPO);

		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getPoint(), memberOrderVO.getPoint(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), memberOrderVO.getOperatePoint(), creater));

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

		UserPO creater = userDao.queryUserByUserId(userId);

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemByOrderId(orderId);

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

			decorationActivityItemDao.update(decorationActivityItemPO);
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {

			cppointPO = new CppointPO();

			cppointPO.setOrderId(orderId);
			cppointPO.getCustomer().setCid(decorationPO.getCustomer().getCid());
			cppointPO.setCompany(decorationPO.getCompany());

			cppointPO.setDpoint(memberDao.amountMemberPointForDecoration(orderId));
			cppointPO.setSpoint(memberDao.amountMemberPointForMaterial(orderId));
		}

		cppointPO.setDpoint(Arith.add(cppointPO.getDpoint(), memberOrderVO.getPoint()));
		cppointPO.setOpoint(memberOrderVO.getSurplusPoint());
		cppointPO.setPoint(Arith.add(cppointPO.getPoint(), memberOrderVO.getPoint()));

		cppointDao.saveOrUpdate(cppointPO);

		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getDpoint(), memberOrderVO.getPoint(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), memberOrderVO.getOperatePoint(), creater));

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
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);
			awardStockPO.setCompany(CompanyPO.TYPE_HEADQUARTER_INT);
			awardStockPO.setFormat(memberGoodsVO.getCategory());

			awardStockDao.save(awardStockPO);
		} else {

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);

			awardStockDao.update(awardStockPO);
		}

		return 0;
	}

}
