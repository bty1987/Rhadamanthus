/**
 * @File Name		: MaterialRefundServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.material.dao.MaterialRefundDao;
import com.fanglin.material.po.MaterialRefundPO;
import com.fanglin.material.service.MaterialRefundService;
import com.fanglin.material.vo.MaterialRefundVO;
import com.fanglin.utils.BeanUtil;

@Service("materialRefundService")
@Transactional(readOnly=true)
public class MaterialRefundServiceImpl implements MaterialRefundService {
	
	@Autowired
	private MaterialRefundDao materialRefundDao;
	
	@Override
	public List<MaterialRefundVO> queryMaterialRefundByMidAIdents(long mid, List<Integer> idents){
		
		List<MaterialRefundPO> materialRefundPOs;
		
		if(idents == null || idents.size() == 0){
			materialRefundPOs = materialRefundDao.queryMaterialRefundByMid(mid);
		}else{
			materialRefundPOs = materialRefundDao.queryMaterialRefundByMidIdents(mid, idents);
		}
		
		List<MaterialRefundVO> materialRefundVOs = new ArrayList<MaterialRefundVO>();
		
		Map<String, MaterialRefundVO> packageFlagMap = new HashMap<String, MaterialRefundVO>();
		Map<String, List<MaterialRefundVO>> packageItemsMap = new HashMap<String, List<MaterialRefundVO>>();
		
		List<MaterialRefundVO> packageItemsList = null;
		
		for(MaterialRefundPO materialRefundPO: materialRefundPOs){
			MaterialRefundVO materialRefundVO = new MaterialRefundVO();
			BeanUtil.copyProperties(materialRefundPO, materialRefundVO);
			
			if(materialRefundPO.getNum() == 0){
				continue;
			}
			
			if(!"".equals(materialRefundPO.getPackageName())){
				String packageName = materialRefundPO.getPackageName();
				int ident = materialRefundPO.getIdent();
				MaterialRefundVO materialRefundPackage = null;
				
				String packageNameIdent = packageName+ident;
				
				if(!packageFlagMap.containsKey(packageNameIdent)){
					materialRefundPackage = new MaterialRefundVO();
				
					materialRefundPackage.setName("-");
					materialRefundPackage.setCategory("-");
					materialRefundPackage.setBrand("-");
					materialRefundPackage.setMeasurementUnit("-");
					
					materialRefundPackage.setNo(packageName);
					materialRefundPackage.setPackageName(packageName);
					materialRefundPackage.setTotal(materialRefundPO.getTotal());
					materialRefundPackage.setMid(materialRefundPO.getMid());
					materialRefundPackage.setStatus(materialRefundPO.getStatus());
					materialRefundPackage.setIdent(materialRefundPO.getIdent());
					
					materialRefundVO.setTotal(0f);
					
					packageFlagMap.put(packageNameIdent, materialRefundPackage);
					
					packageItemsList = new ArrayList<MaterialRefundVO>();
					packageItemsList.add(materialRefundVO);
					
					packageItemsMap.put(packageNameIdent, packageItemsList);
				
				}else{
					packageItemsList = packageItemsMap.get(packageNameIdent);
					
					materialRefundPackage = packageFlagMap.get(packageNameIdent);
					materialRefundVO.setTotal(0f);
					
					packageItemsList.add(materialRefundVO);
				}
			}else{
				materialRefundVOs.add(materialRefundVO);
			}
		}
		
		for(String packageNameIdent: packageFlagMap.keySet()){
			MaterialRefundVO packageItem = packageFlagMap.get(packageNameIdent);
			materialRefundVOs.add(packageItem);
			
			packageItemsList = packageItemsMap.get(packageNameIdent);
			
			for(MaterialRefundVO materialRefundVO: packageItemsList){
				materialRefundVOs.add(materialRefundVO);
			}
		}
		
		return materialRefundVOs;
	}

}
