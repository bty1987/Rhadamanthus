/**
 * @File Name		: BrandDaoImpl.java
 * @Package   	: com.fanglin.data.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.dao.BrandDao;
import com.fanglin.data.po.BrandPO;
import com.fanglin.utils.Paging;

@Repository("brandDao")
public class BrandDaoImpl extends DaoImpl<BrandPO> implements BrandDao {

	public BrandDaoImpl(){
		super(BrandPO.class);
	}

	@Override
	public List<BrandPO> pageBrand(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<BrandPO> query = pagingQuery(paging, BrandPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("categoryId".equals(filter.getField())){
					query.add(query.getCriterion("category.cid", Long.valueOf(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	public List<BrandPO> pageBrandByBrandNamePinYin(Paging paging, String pinyinName) {
		
		PagingQuery<BrandPO> query = pagingQuery(paging, BrandPO.class);
		
		query.add(Restrictions.or(Restrictions.ilike(BrandPO.COLUMN_BRANDNAME_STR, pinyinName, MatchMode.ANYWHERE), Restrictions.ilike(BrandPO.COLUMN_BRANDNAMEPINYIN_STR, pinyinName, MatchMode.ANYWHERE)));
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandPO> queryBrandByCategoryId(long categoryId) {
		return session().createCriteria(BrandPO.class).createAlias("category", "category").add(Restrictions.eq("category.cid", categoryId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandPO> queryBrandByBrandIds(List<String> brandIds) {
		return session().createCriteria(BrandPO.class).add(Restrictions.in("brandId", brandIds)).list();
	}

	@Override
	public BrandPO queryBrandByBId(long bId) {
		return (BrandPO) session().createCriteria(BrandPO.class).add(Restrictions.eq(BrandPO.COLUMN_BID_STR, bId)).uniqueResult();
	}

	@Override
	public BrandPO queryBrandByBrandId(String brandId) {
		return (BrandPO) session().createCriteria(BrandPO.class).add(Restrictions.eq(BrandPO.COLUMN_BRANDID_STR, brandId)).uniqueResult();
	}

}
