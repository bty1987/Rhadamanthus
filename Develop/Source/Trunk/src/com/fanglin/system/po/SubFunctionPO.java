package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "subFunction", catalog = "communion")
public class SubFunctionPO implements Serializable {

	private static final long serialVersionUID = 8882188430338671991L;

	private int id;
	
	private int subFunctionId;
	
	private String subFunctionName;
	
	private FunctionPO function;
	
	private String subfunctionDes;

	private String subfunctionIcon;
	
	private String url;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}
	
	@Id
	@Column(name = "subFunctionId", nullable = false)
	public int getSubFunctionId(){
		return subFunctionId;
	}
	
	public void setSubFunctionId(int functionId){
		this.subFunctionId = functionId;
	}

	@Column(name = "subFunctionName", nullable = false)
	public String getSubFunctionName(){
		return subFunctionName;
	}

	public void setSubFunctionName(String subFunctionName){
		this.subFunctionName = subFunctionName;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "functionId")
	public FunctionPO getFunction(){
		return function;
	}

	public void setFunction(FunctionPO function){
		this.function = function;
	}

	public String getSubfunctionDes(){
		return subfunctionDes;
	}

	public void setSubfunctionDes(String subfunctionDes){
		this.subfunctionDes = subfunctionDes;
	}

	public String getSubfunctionIcon(){
		return subfunctionIcon;
	}

	public void setSubfunctionIcon(String subfunctionIcon){
		this.subfunctionIcon = subfunctionIcon;
	}

	public String getUrl(){
		return url;
	}

	public void setUrl(String url){
		this.url = url;
	}
	
}
