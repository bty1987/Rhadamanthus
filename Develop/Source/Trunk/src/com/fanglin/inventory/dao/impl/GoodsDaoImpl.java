/**
 * @File Name		: GoodsDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.utils.Paging;

@Repository("goodsDao")
public class GoodsDaoImpl extends DaoImpl<GoodsPO> implements GoodsDao {
	
	public GoodsDaoImpl(){
		super(GoodsPO.class);
	}
	
	@Override
	public List<GoodsPO> pageGoods(Paging paging, List<Filter> filters) {
		
		PagingQuery<GoodsPO> query = pagingQuery(paging, GoodsPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<GoodsPO> queryGoods(List<Filter> filters) {

		PagingQuery<GoodsPO> query = pagingQuery(new Paging(), GoodsPO.class);
		
		queryFilterExcute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPO> queryGoodsByName(String name,String pinyin,String no, int limit) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.or(Restrictions.ilike(GoodsPO.COLUMN_NAME_STR, name,MatchMode.ANYWHERE), Restrictions.ilike(GoodsPO.COLUMN_NO_STR, no ,MatchMode.ANYWHERE)), Restrictions.ilike(GoodsPO.COLUMN_PINYIN_STR, pinyin, MatchMode.ANYWHERE))).setMaxResults(limit).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPO> queryGoodsByNo(String no, int limit) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.ilike(GoodsPO.COLUMN_NO_STR, no, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPO> queryGoodsByBarcode(String barcode, int limit) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.ilike(GoodsPO.COLUMN_BARCODE_STR, barcode, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<GoodsPO> queryGoodsByAtid(long atid) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPO.COLUMN_ATID_STR, atid)).list();
	}
	
	@Override
	public GoodsPO queryGoodsByName(String name) {
		return (GoodsPO) session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.eq(GoodsPO.COLUMN_NAME_STR, name), Restrictions.eq(GoodsPO.COLUMN_PINYIN_STR, name))).uniqueResult();
	}

	@Override
	public GoodsPO queryGoodsByNo(String no) {
		return (GoodsPO) session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPO.COLUMN_NO_STR, no)).uniqueResult();
	}

	@Override
	public GoodsPO queryGoodsByBarcode(String barcode) {
		return (GoodsPO) session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPO.COLUMN_BARCODE_STR, barcode)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(GoodsPO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(GoodsPO.COLUMN_NAME_STR, data, op));
				}else if(GoodsPO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion(GoodsPO.COLUMN_NO_STR, data, op));
				}else if(GoodsPO.COLUMN_BARCODE_STR.equals(field)){
					query.add(query.getCriterion(GoodsPO.COLUMN_BARCODE_STR, data, op));
				}else if(GoodsPO.COLUMN_CATEGORY_STR.equals(field)){
					query.add(query.getCriterion(GoodsPO.COLUMN_CATEGORY_STR, data, op));
				}else if(GoodsPO.COLUMN_BRAND_STR.equals(field)){
					query.add(query.getCriterion(GoodsPO.COLUMN_BRAND_STR, data, op));
				}
			}
		}
	}

}
