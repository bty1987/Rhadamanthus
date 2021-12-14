package com.fanglin.inventory.service.impl;

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
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.dao.OccessoriesItemDao;
import com.fanglin.inventory.po.OccessoriesItemPO;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.inventory.service.OccessoriesService;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("occessoriesService")
@Transactional(readOnly = true)
public class OccessoriesServiceImpl implements OccessoriesService {

	@Autowired
	private OccessoriesDao occessoriesDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private CompanyDao companyDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private OccessoriesItemDao occessoriesItemDao;
	
	@Override
	public void pageOccessories(Paging paging, List<Filter> filters, int company) {
		
		List<OccessoriesPO> occessoriesPOs = occessoriesDao.pageOccessories(paging, filters, company);
		
		List<OccessoriesVO> occessoriesVOs = new ArrayList<OccessoriesVO>();
		
		for(OccessoriesPO occessoriesPO : occessoriesPOs){
			
			OccessoriesVO occessoriesVO = new OccessoriesVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			
			BeanUtil.copyProperties(occessoriesPO, occessoriesVO, Arrays.asList("creater", "supervisor","supplier","confirmer","balancer"));
			
			occessoriesVO.getCreater().setBaseInfo(occessoriesPO.getCreater());
			occessoriesVO.getSupervisor().setBaseInfo(occessoriesPO.getSupervisor());
			
			occessoriesVOs.add(occessoriesVO);
		}
		
		paging.setData(occessoriesVOs);
	}

	@Override
	public void pageOccessoriesForSupplier(Paging paging, List<Filter> filters, String userId) {
		
		UserPO user = userDao.queryUserByUserId(userId);
		
		List<OccessoriesPO> occessoriesPOs = occessoriesDao.pageOccessoriesForSupplier(paging, filters, user.getUid());
		
		List<OccessoriesVO> occessoriesVOs = new ArrayList<OccessoriesVO>();
		
		for(OccessoriesPO occessoriesPO : occessoriesPOs){
			
			OccessoriesVO occessoriesVO = new OccessoriesVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			
			BeanUtil.copyProperties(occessoriesPO, occessoriesVO, Arrays.asList("creater", "supervisor","supplier","confirmer","balancer"));
			
			occessoriesVO.getCreater().setBaseInfo(occessoriesPO.getCreater());
			
			occessoriesVO.getSupervisor().setBaseInfo(occessoriesPO.getSupervisor());
			
			occessoriesVOs.add(occessoriesVO);
		}
		
		paging.setData(occessoriesVOs);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(occessoriesVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}
		
		int company = decorationPO.getCompany();

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AO_INT, currentDate, company);
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		UserPO supervisor = userDao.queryUserByUserId(occessoriesVO.getSupervisor().getUserId());
		
		OccessoriesPO occessoriesPO = new OccessoriesPO().init(no, occessoriesVO.getOrderId(), creater, company);
		
		if (occessoriesVO.getSupervisor() != null) {
			occessoriesPO.setSupervisor(supervisor);
		}
		
		occessoriesDao.save(occessoriesPO);
		
		for(OccessoriesItemVO occessoriesItemVO : OccessoriesItemVOs){
			
			OccessoriesItemPO occessoriesItemPO = new OccessoriesItemPO().init(occessoriesPO.getOid(), occessoriesItemVO.getGoods().getGid(), occessoriesItemVO.getNum());
			
			occessoriesItemDao.save(occessoriesItemPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOccessoriesForStatus(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());
		
		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}
		
		occessoriesPO.setStatus(occessoriesVO.getStatus());
		
		occessoriesDao.update(occessoriesPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int bindOccessories(OccessoriesVO occessoriesVO) throws FLException {
		
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}
		
		occessoriesPO.setSupplier(userDao.get(occessoriesVO.getSupplier().getUid()));
		
		occessoriesDao.update(occessoriesPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmOccessories(OccessoriesVO occessoriesVO, String userId) throws FLException {
		
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());
		
		UserPO user = userDao.queryUserByUserId(userId);
		
		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}
		
		if(occessoriesPO.getStatus() != 0){
			throw new FLException(260024, "辅料单状态不可操作");
		}
		
		occessoriesPO.setStatus(occessoriesVO.getStatus());
		occessoriesPO.setConfirmer(user);
		
		occessoriesDao.update(occessoriesPO);
		
		return 0;
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceOccessories(OccessoriesVO occessoriesVO, String userId) throws FLException {
	
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());
		
		UserPO user = userDao.queryUserByUserId(userId);
		
		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}
		
		if(occessoriesPO.getStatus() != 1){
			throw new FLException(260024, "辅料单状态不可操作");
		}
		occessoriesPO.setStatus(occessoriesVO.getStatus());
		occessoriesPO.setBalancer(user);
		
		occessoriesDao.update(occessoriesPO);
		
		return 0;
		
	}

}
