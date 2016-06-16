package com.fanglin.core.dao.impl;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;

import com.fanglin.core.dao.Dao;

public class DaoImpl<T> extends GenericDaoImpl implements Dao<T> {

	protected Class<T> entityClass; // 实体类型
	
	private boolean cacheable = false;

	public DaoImpl(){
		
	}

	public DaoImpl(Class<T> entityClass){
		super();
		this.entityClass = entityClass;
	}

	public DaoImpl(Class<T> entityClass, boolean cacheable) {
		super();
		this.entityClass = entityClass;
		this.cacheable = cacheable;
	}

	/**
	 * 根据ID获取数据对象
	 */
	@Override
	public T get(Serializable id){
		return get(entityClass, id);
	}

	/**
	 * 根据ID删除数据对象
	 */
	@Override
	public void deleteById(Serializable id){
		deleteById(entityClass, id);
	}

	protected Criteria createCriteria(){
		return createCriteria(entityClass);
	}
	
	public Criterion getCriterion(String propertyName, Object value, String op){
		if("eq".equals(op)){
			return Restrictions.eq(propertyName,value);
		}else if("cn".equals(op)){
			return Restrictions.ilike(propertyName, (String) value, MatchMode.ANYWHERE);
		}else if("nc".equals(op)){
			return Restrictions.not(Restrictions.ilike(propertyName, (String) value, MatchMode.ANYWHERE));
		}else if("lt".equals(op)){
			return Restrictions.lt(propertyName, value);
		}else if("le".equals(op)){
			return Restrictions.le(propertyName, value);
		}else if("gt".equals(op)){
			return Restrictions.gt(propertyName, value);
		}else if("ge".equals(op)){
			return Restrictions.ge(propertyName, value);
		}else if("bw".equals(op)){
			return Restrictions.ilike(propertyName, (String) value, MatchMode.START);
		}else if("ew".equals(op)){
			return Restrictions.ilike(propertyName, (String) value, MatchMode.END);
		}else if("bn".equals(op)){
			return Restrictions.not(Restrictions.ilike(propertyName, (String) value, MatchMode.START));
		}else if("en".equals(op)){
			return Restrictions.not(Restrictions.ilike(propertyName, (String) value, MatchMode.END));
		}else if("ne".equals(op)){
			return Restrictions.ne(propertyName,value);
		}else if("likecn".equals(op)){
			return Restrictions.like(propertyName, value);
		}else{
			return Restrictions.eq(propertyName,value);
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> list(){
		return createCriteria().setCacheable(cacheable).list();
	}

	protected TopQuery<T> topQuery(int maxResults){
		return topQuery(maxResults, entityClass, null);
	}

	protected TopQuery<T> topQuery(int maxResults, String cacheRegion){
		return topQuery(maxResults, entityClass, cacheRegion);
	}

	public boolean getCacheable() {
		return cacheable;
	}

	public void setCacheable(boolean cacheable) {
		this.cacheable = cacheable;
	}

}
