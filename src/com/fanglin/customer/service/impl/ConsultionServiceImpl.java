package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ConsultionDao;
import com.fanglin.customer.po.ConsultionPO;
import com.fanglin.customer.service.ConsultionService;
import com.fanglin.customer.vo.ConsultionVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("consultionService")
@Transactional(readOnly = true)
public class ConsultionServiceImpl implements ConsultionService {

	@Autowired
	private ConsultionDao consultionDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageConsultion(Paging paging, List<Filter> filters, String userId) {

		UserPO user = userDao.queryUserByUserId(userId);

		filters.add(new Filter(ConsultionPO.COLUMN_CREATER_UID_STR, String.valueOf(user.getUid()), "eq"));

		List<ConsultionPO> consultionPOs = consultionDao.pageConsultion(paging, filters);
		List<ConsultionVO> consultionVOs = new ArrayList<ConsultionVO>();

		for (ConsultionPO consultionPO : consultionPOs) {
			consultionVOs.add(consultionPOToVO(consultionPO));
		}

		paging.setData(consultionVOs);
	}

	@Override
	public List<ConsultionVO> queryConsultionByOrderId(ConsultionVO consultion) {

		String orderId = consultion.getDecoration().getOrderId();

		List<ConsultionPO> consultionPOs = consultionDao.queryConsultionByOrderId(orderId);
		List<ConsultionVO> consultionVOs = new ArrayList<ConsultionVO>();

		for (ConsultionPO consultionPO : consultionPOs) {
			consultionVOs.add(consultionPOToVO(consultionPO));
		}
		return consultionVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConsultion(ConsultionVO consultionVO, String userId, int company) throws FLException {

		String orderId = "";

		if (consultionVO.getDecoration() != null) {
			orderId = consultionVO.getDecoration().getOrderId();
		}

		UserPO userPO = userDao.queryUserByUserId(userId);
		CompanyPO companyPO = companyDao.get(company);

		ConsultionPO consultionPO = new ConsultionPO(null, userPO);
		BeanUtil.copyProperties(consultionVO, consultionPO, Arrays.asList("decoration", "creater"));

		if (!orderId.equals("")) {
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(consultionVO.getDecoration().getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "	订单不存在");
			}

			consultionPO.setDecoration(decorationPO);
		}

		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_COMSULTION_NO_INT, currentDate, company);
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		consultionPO.setNo(no);
		consultionPO.setCompany(company);

		consultionDao.save(consultionPO);

	}

	public ConsultionVO consultionPOToVO(ConsultionPO consultionPO) {

		ConsultionVO consultionVO = new ConsultionVO(new DecorationVO(), new UserBaseVO());
		BeanUtil.copyProperties(consultionPO, consultionVO, Arrays.asList("decoration", "creater"));
		BeanUtil.copyProperties(consultionPO.getCreater(), consultionVO.getCreater(), Arrays.asList("duty", "dept"));

		if (consultionPO.getDecoration() != null) {
			consultionPO.getDecoration().ptvcascade(consultionVO.getDecoration());
		}

		return consultionVO;
	}

}
