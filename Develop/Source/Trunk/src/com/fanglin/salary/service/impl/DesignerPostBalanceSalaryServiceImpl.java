/**
 * @File Name		: DesignerPostBalanceSalaryService.java
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

import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.DesignerPostBalanceSalaryDao;
import com.fanglin.salary.po.DesignerPostBalanceSalaryPO;
import com.fanglin.salary.service.DesignerPostBalanceSalaryService;
import com.fanglin.salary.vo.DesignerPostBalanceSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("designerPostBalanceSalaryService")
@Transactional(rollbackFor=Exception.class)
public class DesignerPostBalanceSalaryServiceImpl implements DesignerPostBalanceSalaryService {
	
	@Autowired
	private DesignerPostBalanceSalaryDao designerPostBalanceSalaryDao;

	@Override
	public void pageDesignerPostBalanceSalary(Paging paging, List<Filter> filters) {
		
		List<DesignerPostBalanceSalaryPO> designerPostBalanceSalaryPOs = designerPostBalanceSalaryDao.pageDesignerPostBalanceSalary(paging, filters);
		List<DesignerPostBalanceSalaryVO> designerPostBalanceSalaryVOs = new ArrayList<DesignerPostBalanceSalaryVO>();
		
		for(DesignerPostBalanceSalaryPO designerPostBalanceSalaryPO: designerPostBalanceSalaryPOs){
			DesignerPostBalanceSalaryVO designerPostBalanceSalaryVO = new DesignerPostBalanceSalaryVO();
			BeanUtil.copyProperties(designerPostBalanceSalaryPO, designerPostBalanceSalaryVO);
			
			designerPostBalanceSalaryVOs.add(designerPostBalanceSalaryVO);
		}
		
		paging.setData(designerPostBalanceSalaryVOs);
	}

	@Override
	public void addDesignerPostBalanceSalary(DesignerPostBalanceSalaryVO designerPostBalanceSalaryVO) {
		
		DesignerPostBalanceSalaryPO designerPostBalanceSalaryPO = new DesignerPostBalanceSalaryPO();
		BeanUtil.copyProperties(designerPostBalanceSalaryVO, designerPostBalanceSalaryPO);
		
		designerPostBalanceSalaryPO.setCreateTime(DateUtil.current(DesignerPostBalanceSalaryPO.CURRENT_TIME_FORMAT_STR));
		
		designerPostBalanceSalaryDao.saveOrUpdate(designerPostBalanceSalaryPO);
	}

}
