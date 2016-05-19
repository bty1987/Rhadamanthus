/**
 * @File Name		: DesignerSalaryServiceImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.DesignerDeductSalaryDao;
import com.fanglin.salary.dao.DesignerOutsideSalaryDao;
import com.fanglin.salary.dao.DesignerPostBalanceSalaryDao;
import com.fanglin.salary.dao.DesignerPreBalanceSalaryDao;
import com.fanglin.salary.dao.DesignerSalaryDao;
import com.fanglin.salary.po.DesignerDeductSalaryPO;
import com.fanglin.salary.po.DesignerOutsideSalaryPO;
import com.fanglin.salary.po.DesignerPostBalanceSalaryPO;
import com.fanglin.salary.po.DesignerPreBalanceSalaryPO;
import com.fanglin.salary.po.DesignerSalaryPO;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.DesignerSalaryService;
import com.fanglin.salary.vo.DesignerSalaryVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("designerSalaryService")
@Transactional(readOnly=true)
public class DesignerSalaryServiceImpl implements DesignerSalaryService {
	
	@Autowired
	private DesignerSalaryDao designerSalaryDao;
	
	@Autowired
	private DesignerPreBalanceSalaryDao designerPreBalanceSalaryDao;
	
	@Autowired
	private DesignerPostBalanceSalaryDao designerPostBalanceSalaryDao;
	
	@Autowired
	private DesignerOutsideSalaryDao designerOutsideSalaryDao;
	
	@Autowired
	private DesignerDeductSalaryDao designerDeductSalaryDao;

	@Override
	public void pageDesignerSalary(Paging paging, List<FilterVO> filters) {
		
		List<DesignerSalaryPO> designerSalaryPOs = designerSalaryDao.pageDesignerSalary(paging, filters, null);
		List<DesignerSalaryVO> designerSalaryVOs = new ArrayList<DesignerSalaryVO>();
		
		for(DesignerSalaryPO designerSalaryPO: designerSalaryPOs){
			DesignerSalaryVO designerSalaryVO = new DesignerSalaryVO();
			BeanUtil.copyProperties(designerSalaryPO, designerSalaryVO);
			
			designerSalaryVOs.add(designerSalaryVO);
		}
		
		paging.setData(designerSalaryVOs);
	}

	@Override
	public void pageDesignerSalaryForInit(Paging paging, List<FilterVO> filters) {
		
		List<DesignerSalaryPO> designerSalaryPOs = designerSalaryDao.pageDesignerSalary(paging, filters, DesignerSalaryPO.STATUS_TYPE_INIT_INT);
		List<DesignerSalaryVO> designerSalaryVOs = new ArrayList<DesignerSalaryVO>();
		
		for(DesignerSalaryPO designerSalaryPO: designerSalaryPOs){
			DesignerSalaryVO designerSalaryVO = new DesignerSalaryVO();
			BeanUtil.copyProperties(designerSalaryPO, designerSalaryVO);
			
			designerSalaryVOs.add(designerSalaryVO);
		}
		
		paging.setData(designerSalaryVOs);
		
	}

	@Override
	public void pageDesignerSalaryForPayOff(Paging paging, List<FilterVO> filters) {
		
		List<DesignerSalaryPO> designerSalaryPOs = designerSalaryDao.pageDesignerSalary(paging, filters, DesignerSalaryPO.STATUS_TYPE_PAYOFF_INT);
		List<DesignerSalaryVO> designerSalaryVOs = new ArrayList<DesignerSalaryVO>();
		
		for(DesignerSalaryPO designerSalaryPO: designerSalaryPOs){
			DesignerSalaryVO designerSalaryVO = new DesignerSalaryVO();
			BeanUtil.copyProperties(designerSalaryPO, designerSalaryVO);
			
			designerSalaryVOs.add(designerSalaryVO);
		}
		
		paging.setData(designerSalaryVOs);
	}

	@Override
	public void pageDesignerSalaryForUnPayOff(Paging paging, List<FilterVO> filters) {
		
		List<DesignerSalaryPO> designerSalaryPOs = designerSalaryDao.pageDesignerSalary(paging, filters, DesignerSalaryPO.STATUS_TYPE_UNPAYOFF_INT);
		List<DesignerSalaryVO> designerSalaryVOs = new ArrayList<DesignerSalaryVO>();
		
		for(DesignerSalaryPO designerSalaryPO: designerSalaryPOs){
			DesignerSalaryVO designerSalaryVO = new DesignerSalaryVO();
			BeanUtil.copyProperties(designerSalaryPO, designerSalaryVO);
			
			designerSalaryVOs.add(designerSalaryVO);
		}
		
		paging.setData(designerSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void payDesignerSalary() {
		
		String currentTime = DateUtil.current(WorkerSalaryPO.CURRENT_TIME_FORMAT_STR);
		
		List<DesignerSalaryPO> designerSalaryPOs = designerSalaryDao.queryDesignerSalaryByInit();
		
		for(DesignerSalaryPO designerSalaryPO: designerSalaryPOs){
			designerSalaryPO.setStatus(DesignerSalaryPO.STATUS_TYPE_PAYOFF_INT);
			designerSalaryPO.setEndTime(currentTime);
			
			int dsId = designerSalaryPO.getDsId();
			
			List<DesignerPreBalanceSalaryPO> designerPreBalanceSalaryPOs = designerPreBalanceSalaryDao.queryDesignerPreBalanceSalaryByDsId(dsId);
			for(DesignerPreBalanceSalaryPO designerPreBalanceSalaryPO: designerPreBalanceSalaryPOs){
				designerPreBalanceSalaryPO.setStatus(DesignerPreBalanceSalaryPO.STATUS_TYPE_PAYOFF_INT);
				designerPreBalanceSalaryDao.update(designerPreBalanceSalaryPO);
			}
			
			List<DesignerPostBalanceSalaryPO> designerPostBalanceSalaryPOs = designerPostBalanceSalaryDao.queryDesignerPostBalanceSalaryByDsId(dsId);
			for(DesignerPostBalanceSalaryPO designerPostBalanceSalaryPO: designerPostBalanceSalaryPOs){
				designerPostBalanceSalaryPO.setStatus(DesignerPostBalanceSalaryPO.STATUS_TYPE_PAYOFF_INT);
				designerPostBalanceSalaryDao.update(designerPostBalanceSalaryPO);
			}
			
			List<DesignerOutsideSalaryPO> designerOutsideSalaryPOs = designerOutsideSalaryDao.queryDesignerOutsideSalaryByDsId(dsId);
			for(DesignerOutsideSalaryPO designerOutsideSalaryPO: designerOutsideSalaryPOs){
				designerOutsideSalaryPO.setStatus(DesignerOutsideSalaryPO.STATUS_PAYOFF_INT);
				designerOutsideSalaryDao.update(designerOutsideSalaryPO);
			}
			
			List<DesignerDeductSalaryPO> designerDeductSalaryPOs = designerDeductSalaryDao.queryDesignerDeductSalaryByDsId(dsId);
			for(DesignerDeductSalaryPO designerDeductSalaryPO: designerDeductSalaryPOs){
				designerDeductSalaryPO.setStatus(DesignerDeductSalaryPO.STATUS_TYPE_PAYOFF_INT);
				designerDeductSalaryDao.update(designerDeductSalaryPO);
			}
			
			float total = Arith.sub(designerSalaryPO.getMaterial(), designerSalaryPO.getDeduct());
			
			if(total < 0){
				
				DesignerSalaryPO _designerSalaryPO = new DesignerSalaryPO();
				BeanUtil.copyProperties(designerSalaryPO, _designerSalaryPO);
				_designerSalaryPO.setDeduct(Math.abs(total));
				_designerSalaryPO.setMaterial(0);
				_designerSalaryPO.setStatus(DesignerSalaryPO.STATUS_TYPE_INIT_INT);
				_designerSalaryPO.setDsId(0);
				_designerSalaryPO.setPdsId(designerSalaryPO.getDsId());
				_designerSalaryPO.setCreateTime(currentTime);
				_designerSalaryPO.setEndTime(currentTime);
				
				designerSalaryDao.saveOrUpdate(_designerSalaryPO);
				
				DesignerDeductSalaryPO designerDeductSalaryPO = new DesignerDeductSalaryPO();
				BeanUtil.copyProperties(designerSalaryPO, designerDeductSalaryPO);
				designerDeductSalaryPO.setCreateTime(currentTime);
				designerDeductSalaryPO.setDsId(_designerSalaryPO.getDsId());
				designerDeductSalaryPO.setDeduct(Math.abs(total));
				designerDeductSalaryPO.setDes("结算工资产生的扣款信息");
				
				designerDeductSalaryDao.saveOrUpdate(designerDeductSalaryPO);
			}
			
			designerSalaryDao.update(designerSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void payoffDesignerSalary(DesignerSalaryVO designerSalaryVO) {
		
		DesignerSalaryPO designerSalaryPO = designerSalaryDao.queryDesignerSalaryByDsId(designerSalaryVO.getDsId());
		if(designerSalaryPO != null && designerSalaryPO.getStatus() == DesignerSalaryPO.STATUS_TYPE_UNPAYOFF_INT){
			designerSalaryPO.setStatus(DesignerSalaryPO.STATUS_TYPE_PAYOFF_INT);
			designerSalaryDao.update(designerSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void unpayoffDesignerSalary(DesignerSalaryVO designerSalaryVO) {
		
		DesignerSalaryPO designerSalaryPO = designerSalaryDao.queryDesignerSalaryByDsId(designerSalaryVO.getDsId());
		if(designerSalaryPO != null && designerSalaryPO.getStatus() == DesignerSalaryPO.STATUS_TYPE_PAYOFF_INT){
			designerSalaryPO.setStatus(DesignerSalaryPO.STATUS_TYPE_UNPAYOFF_INT);
			designerSalaryDao.update(designerSalaryPO);
		}
	}
}
