/**
 * @File Name		: VenderBalanceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-11-14
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
import com.fanglin.salary.dao.VenderBalanceDao;
import com.fanglin.salary.dao.VenderPostBalanceDao;
import com.fanglin.salary.dao.VenderPreBalanceDao;
import com.fanglin.salary.po.VenderBalancePO;
import com.fanglin.salary.po.VenderPostBalancePO;
import com.fanglin.salary.po.VenderPreBalancePO;
import com.fanglin.salary.service.VenderBalanceService;
import com.fanglin.salary.vo.VenderBalanceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("venderBalanceService")
@Transactional(readOnly=true)
public class VenderBalanceServiceImpl implements VenderBalanceService {
	
	@Autowired
	private VenderBalanceDao venderBalanceDao;
	
	@Autowired
	private VenderPreBalanceDao venderPreBalanceDao;
	
	@Autowired
	private VenderPostBalanceDao venderPostBalanceDao;

	@Override
	public void pageVenderBalance(Paging paging, List<FilterVO> filters) {
		
		List<VenderBalancePO> venderBalancePOs = venderBalanceDao.pageVenderBalance(paging, filters, null);
		List<VenderBalanceVO> venderBalanceVOs = new ArrayList<VenderBalanceVO>();
		
		for(VenderBalancePO venderBalancePO: venderBalancePOs){
			VenderBalanceVO venderBalanceVO = new VenderBalanceVO();
			BeanUtil.copyProperties(venderBalancePO, venderBalanceVO);
			venderBalanceVOs.add(venderBalanceVO);
		}
		
		paging.setData(venderBalanceVOs);
	}

	@Override
	public void pageVenderBalanceForInit(Paging paging, List<FilterVO> filters) {
		
		List<VenderBalancePO> venderBalancePOs = venderBalanceDao.pageVenderBalance(paging, filters, VenderBalancePO.STATUS_TYPE_INIT_INT);
		List<VenderBalanceVO> venderBalanceVOs = new ArrayList<VenderBalanceVO>();
		
		for(VenderBalancePO venderBalancePO: venderBalancePOs){
			VenderBalanceVO venderBalanceVO = new VenderBalanceVO();
			BeanUtil.copyProperties(venderBalancePO, venderBalanceVO);
			venderBalanceVOs.add(venderBalanceVO);
		}
		
		paging.setData(venderBalanceVOs);
	}

	@Override
	public void pageVenderBalanceForPayOff(Paging paging, List<FilterVO> filters) {
		
		List<VenderBalancePO> venderBalancePOs = venderBalanceDao.pageVenderBalance(paging, filters, VenderBalancePO.STATUS_TYPE_PAYOFF_INT);
		List<VenderBalanceVO> venderBalanceVOs = new ArrayList<VenderBalanceVO>();
		
		for(VenderBalancePO venderBalancePO: venderBalancePOs){
			VenderBalanceVO venderBalanceVO = new VenderBalanceVO();
			BeanUtil.copyProperties(venderBalancePO, venderBalanceVO);
			venderBalanceVOs.add(venderBalanceVO);
		}
		
		paging.setData(venderBalanceVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void payVenderBalance() {
		
		List<VenderBalancePO> venderBalancePOs = venderBalanceDao.queryVenderBalanceByInit();
		
		for(VenderBalancePO venderBalancePO: venderBalancePOs){
			venderBalancePO.setStatus(VenderBalancePO.STATUS_TYPE_PAYOFF_INT);
			venderBalancePO.setEndTime(DateUtil.current(VenderBalancePO.CURRENT_TIME_FORMAT_STR));
			
			int vbId = venderBalancePO.getVbId();
			
			List<VenderPreBalancePO> venderPreBalancePOs = venderPreBalanceDao.queryVenderPreBalanceByVbId(vbId);
			for(VenderPreBalancePO venderPreBalancePO: venderPreBalancePOs){
				venderPreBalancePO.setStatus(VenderPreBalancePO.STATUS_TYPE_PAYOFF_INT);
				venderPreBalanceDao.update(venderPreBalancePO);
			}
			
			List<VenderPostBalancePO> venderPostBalancePOs = venderPostBalanceDao.queryVenderPostBalanceByVbId(vbId);
			for(VenderPostBalancePO venderPostBalancePO: venderPostBalancePOs){
				venderPostBalancePO.setStatus(VenderPostBalancePO.STATUS_YTPE_PAYOFF_INT);
				venderPostBalanceDao.update(venderPostBalancePO);
			}
			
			venderBalanceDao.update(venderBalancePO);
		}
	}
}
