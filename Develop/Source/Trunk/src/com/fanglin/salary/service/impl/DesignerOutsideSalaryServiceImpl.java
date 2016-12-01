/**
 * @File Name		: DesignerOutsideSalaryServiceImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-11-7
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
import com.fanglin.salary.dao.DesignerOutsideSalaryDao;
import com.fanglin.salary.po.DesignerOutsideSalaryPO;
import com.fanglin.salary.service.DesignerOutsideSalaryService;
import com.fanglin.salary.vo.DesignerOutsideSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("designerOutsideSalaryService")
@Transactional(readOnly=true)
public class DesignerOutsideSalaryServiceImpl implements DesignerOutsideSalaryService {
	
	@Autowired
	private DesignerOutsideSalaryDao designerOutsideSalaryDao;

	@Override
	public void pageDesignerOutsideSalary(Paging paging, List<Filter> filters) {
		
		List<DesignerOutsideSalaryPO> designerOutsideSalaryPOs = designerOutsideSalaryDao.pageDesignerOutsideSalary(paging, filters);
		List<DesignerOutsideSalaryVO> designerOutsideSalaryVOs = new ArrayList<DesignerOutsideSalaryVO>();
		
		for(DesignerOutsideSalaryPO designerOutsideSalaryPO: designerOutsideSalaryPOs){
			DesignerOutsideSalaryVO designerOutsideSalaryVO = new DesignerOutsideSalaryVO();
			BeanUtil.copyProperties(designerOutsideSalaryPO, designerOutsideSalaryVO);
			
			designerOutsideSalaryVOs.add(designerOutsideSalaryVO);
		}
		
		paging.setData(designerOutsideSalaryVOs);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addDesignerOutsideSalary(DesignerOutsideSalaryVO designerOutsideSalaryVO) {
		
		DesignerOutsideSalaryPO designerOutsideSalaryPO = new DesignerOutsideSalaryPO();
		
		BeanUtil.copyProperties(designerOutsideSalaryVO, designerOutsideSalaryPO);
		
		designerOutsideSalaryDao.saveOrUpdate(designerOutsideSalaryPO);
	}
}
