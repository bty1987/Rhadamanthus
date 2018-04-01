/**
 * @File Name	: ConstructionServiceImpl.java
 * @Package   	: com.fanglin.service.impl.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.ConstructionService;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constructionService")
@Transactional(readOnly=true)
public class ConstructionServiceImpl implements ConstructionService {
	
	@Autowired
	private ConstructionDao constructionDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CustomerService customerService;
	
	@Override
	public void pageConstruction(Paging paging, List<Filter> filters, Integer company){
		
		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(ConstructionPO constructionPO: constructionPOs){
			
			decorationVOs.add(decorationPOToVO(constructionPO.getDecoration()));
		}
		
		paging.setData(decorationVOs);
	}
	
	@Override
	public void pageConstructionForSupervision(Paging paging, List<Filter> filters, String userId) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<ConstructionPO> constructionSchedulePOs = constructionDao.pageConstructionForSupervision(paging, filters, userPO.getUid());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(ConstructionPO constructionSchedulePO: constructionSchedulePOs){
			
			decorationVOs.add(decorationPOToVO(constructionSchedulePO.getDecoration()));
		}
		
		
		
		paging.setData(decorationVOs);
	}
	
	@Override
	public void pageConstructionForAcceptance(Paging paging, List<Filter> filters, Integer company){
		
		String acceptanceFlagOp = null;
	
		for(Filter filter: filters){
			if(ConstructionPO.COLUMN_ACCEPTANCEFLAG_STR.equals(filter.getField())){
				String _flag = filter.getData();
				
				if("notAcceptanced".equals(_flag)){
					acceptanceFlagOp = "nand";
				}else{
					acceptanceFlagOp = "and";
				}
			}
		}
		
		filters.add(new Filter(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR, String.valueOf(AcceptancePO.ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT), acceptanceFlagOp));
		
		List<ConstructionPO> constructionPOs = constructionDao.pageConstructionForAcceptance(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(ConstructionPO constructionPO: constructionPOs){
			decorationVOs.add(decorationPOToVO(constructionPO.getDecoration()));
		}
		
		paging.setData(decorationVOs);
	}
	
	@Override
	public ConstructionVO queryConstructionById(int cid){
		
		ConstructionPO constructionPO = constructionDao.get(cid);
		ConstructionVO constructionVO = new ConstructionVO(new UserBaseVO());
		
		BeanUtil.copyProperties(constructionPO, constructionVO);
		
		return constructionVO;
	}
	
	@Override
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO){
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());
		
		BeanUtil.copyProperties(constructionPO, constructionVO,Arrays.asList("decoration", "supervisor"));
		
		constructionVO.setSupervisor(new UserBaseVO());
		BeanUtil.copyProperties(constructionPO.getSupervisor(), constructionVO.getSupervisor(), Arrays.asList("duty", "dept"));
		
		return constructionVO;
	}
	
	@Override
	public ConstructionVO queryConstructionForWorkerNameByOrderId(ConstructionVO constructionVO){
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());
		ConstructionVO _constructionVO = new ConstructionVO();
		if(constructionPO != null){
			BeanUtil.copyProperties(constructionPO, _constructionVO,Arrays.asList("decoration", "supervisor"));
			if(constructionPO.getSupervisor() != null){
				_constructionVO.setSupervisor(new UserBaseVO());
				BeanUtil.copyProperties(constructionPO.getSupervisor(),_constructionVO.getSupervisor(),Arrays.asList("duty", "dept"));
			}
			
		}
		
		return _constructionVO;
	}
	
	//这个方法 看一下，没有用的地方可以删除了
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateConstruction(ConstructionVO constructionVO){
		
		ConstructionPO constructionPO = null;
		
		if(constructionVO.getCid() == 0){
			constructionPO = new ConstructionPO(new DecorationPO(), new UserPO());
		}else{
			constructionPO = constructionDao.get(constructionVO.getCid());
		}
		
		BeanUtil.copyProperties(constructionVO, constructionPO, Arrays.asList("decoration", "supervisorQuality"));
		constructionDao.saveOrUpdate(constructionPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateConstructionByOrderId(ConstructionVO constructionVO){
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());
		
		if(constructionPO == null){
			DecorationPO decorationPO = decorationDao.get(constructionVO.getOrderId());
			constructionPO = new ConstructionPO(decorationPO, new UserPO());
			//constructionPO.setDecoration(new DecorationPO());
			constructionPO.setSchedule(ConstructionPO.SCHEDULE_TYPE_CHAN_INT);
		}
		
		BeanUtil.copyProperties(constructionVO, constructionPO, Arrays.asList("decoration", "supervisor"));

		if(constructionVO.getSupervisor() != null){
			constructionPO.setSupervisor(userDao.queryUserByUserId(constructionVO.getSupervisor().getUserId()));
		}
		
		constructionDao.saveOrUpdate(constructionPO);
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(constructionVO.getOrderId());
		if(decorationPO != null){
			if(constructionVO.getSupervisor() != null){
				UserPO userPO = userDao.queryUserByUserId(constructionVO.getSupervisor().getUserId());
				decorationPO.setSupervisor(userPO);
			}else{
				decorationPO.setSupervisor(null);
			}
			
			decorationDao.update(decorationPO);
		}
	}
	
	private DecorationVO decorationPOToVO(DecorationPO decorationPO){
		
		DecorationVO decorationVO = new DecorationVO();
		decorationVO.setHouse(new HouseVO());
		decorationVO.setDesigner(new UserBaseVO(null, new DepartmentVO()));
		decorationVO.setSalesman(new UserBaseVO(null, new DepartmentVO()));
		decorationVO.setSupervisor(new UserBaseVO(new DutyVO(), new DepartmentVO(null, new DepartmentVO(), null)));
		
		decorationPO.ptvcascade(decorationVO);
		
		CustomerVO customerPhones = customerService.queryCustomerById(decorationVO.getCustomer());
		decorationVO.getCustomer().setPhone(customerPhones.getPhone());
		
		return decorationVO;
	}
}
